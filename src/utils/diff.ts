/**
 * Git-like diff protocol for resume data.
 * Computes lightweight diffs between resume states and applies patches.
 * Only changed fields are transmitted over the wire.
 */

import { ResumeData } from '@/types/editor.types';

// ── Patch operations (simplified JSON Patch) ──────────────────────────

export interface ReplaceOp {
  op: 'replace';
  path: string;
  value: unknown;
}

export interface AddOp {
  op: 'add';
  path: string;
  value: unknown;
}

export interface RemoveOp {
  op: 'remove';
  path: string;
}

export type PatchOp = ReplaceOp | AddOp | RemoveOp;

export interface DiffPayload {
  baseHash: string;
  ops: PatchOp[];
}

// ── Hashing ───────────────────────────────────────────────────────────

/**
 * Deterministic JSON serialization (sorted keys, no whitespace)
 * so the same object always produces the same hash.
 */
function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify((obj as Record<string, unknown>)[k])).join(',') + '}';
}

/**
 * Compute a fast, non-cryptographic hash (FNV-1a 32-bit) of any value.
 * Returns a hex string. Good enough for change detection — not for security.
 */
export function computeHash(value: unknown): string {
  const str = stableStringify(value);
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // FNV prime, keep as uint32
  }
  return hash.toString(16).padStart(8, '0');
}

// ── Diff computation ──────────────────────────────────────────────────

/**
 * Compute a minimal diff between two arrays using index-based matching.
 * Handles additions, removals, and modifications.
 * Removals are returned in descending index order so patches apply correctly.
 */
function diffArrays(
  oldArr: unknown[],
  newArr: unknown[],
  basePath: string,
): PatchOp[] {
  const ops: PatchOp[] = [];

  // Remove extra items from old array that exceed new array length.
  // Emit removals in descending index order so splice operations don't shift subsequent indices.
  for (let i = oldArr.length - 1; i >= newArr.length; i--) {
    ops.push({ op: 'remove', path: `${basePath}/${i}` });
  }

  // Update or add items
  for (let i = 0; i < newArr.length; i++) {
    const itemPath = `${basePath}/${i}`;
    if (i < oldArr.length) {
      ops.push(...diffValues(oldArr[i], newArr[i], itemPath));
    } else {
      ops.push({ op: 'add', path: itemPath, value: newArr[i] });
    }
  }

  return ops;
}

function diffValues(
  oldVal: unknown,
  newVal: unknown,
  path: string,
): PatchOp[] {
  // Same reference or same primitive → no change
  if (oldVal === newVal) return [];

  // One is null/undefined and the other isn't → replace
  if (oldVal == null || newVal == null || typeof oldVal !== typeof newVal) {
    return [{ op: 'replace', path, value: newVal }];
  }

  // Both are arrays → diff element-by-element
  if (Array.isArray(oldVal) && Array.isArray(newVal)) {
    return diffArrays(oldVal, newVal, path);
  }

  // Both are objects → recurse into keys
  if (typeof oldVal === 'object' && typeof newVal === 'object') {
    return diffObjects(oldVal as Record<string, unknown>, newVal as Record<string, unknown>, path);
  }

  // Primitive changed
  if (oldVal !== newVal) {
    return [{ op: 'replace', path, value: newVal }];
  }

  return [];
}

function diffObjects(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  basePath: string,
): PatchOp[] {
  const ops: PatchOp[] = [];
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const childPath = `${basePath}/${key}`;
    if (!(key in oldObj)) {
      ops.push({ op: 'add', path: childPath, value: newObj[key] });
    } else if (!(key in newObj)) {
      ops.push({ op: 'remove', path: childPath });
    } else {
      ops.push(...diffValues(oldObj[key], newObj[key], childPath));
    }
  }

  return ops;
}

/**
 * Compute the minimal diff between two ResumeData objects.
 * Returns null if they are identical (no changes to send).
 */
export function computeDiff(
  oldResume: ResumeData | null,
  newResume: ResumeData,
): DiffPayload | null {
  const oldHash = computeHash(oldResume);
  const newHash = computeHash(newResume);

  if (oldHash === newHash) return null; // No changes

  const ops = diffValues(oldResume, newResume, '');
  if (ops.length === 0) return null;

  return { baseHash: oldHash, ops };
}

// ── Patch application ─────────────────────────────────────────────────

function setByPath(obj: unknown, path: string, value: unknown): void {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return;
  let current = obj as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isArrayIndex = /^\d+$/.test(nextKey);
    if (!(key in current)) {
      current[key] = isArrayIndex ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;
}

function deleteByPath(obj: unknown, path: string): void {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return;
  let current = obj as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]] as Record<string, unknown>;
  }
  const lastKey = parts[parts.length - 1];
  if (Array.isArray(current)) {
    current.splice(Number(lastKey), 1);
  } else {
    delete current[lastKey];
  }
}

/**
 * Apply a series of patch operations to a ResumeData object.
 * IMPORTANT: Removals must be in descending index order to avoid index shifting.
 * Returns a new object (does not mutate the original).
 */
export function applyPatch(
  base: ResumeData,
  ops: PatchOp[],
): ResumeData {
  // Deep clone to avoid mutation
  const result: ResumeData = JSON.parse(JSON.stringify(base));

  for (const op of ops) {
    switch (op.op) {
      case 'replace':
        setByPath(result, op.path, op.value);
        break;
      case 'add':
        setByPath(result, op.path, op.value);
        break;
      case 'remove':
        deleteByPath(result, op.path);
        break;
    }
  }

  return result;
}
