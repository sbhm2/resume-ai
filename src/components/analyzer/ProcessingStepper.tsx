import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export interface Step {
  id: string;
  label: string;
  description: string;
  showIf?: boolean;
}

interface ProcessingStepperProps {
  steps: Step[];
  isActive: boolean;
  /** When set to true, immediately completes all remaining steps */
  fastForward?: boolean;
  onComplete?: () => void;
}

const STEP_DURATIONS: Record<string, number> = {
  upload: 400,
  extract: 700,
  understand: 1200,
  match: 1500,
  ats: 1500,
  suggestions: 1000,
  coverLetter: 900,
  interview: 800,
  finalize: 600,
};

const LOADING_TEXTS = [
  'Analyzing your resume...',
  'Still working...',
  'Almost there...',
  'Finalizing results...',
];

const LoadingDots = () => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <span>{dots}</span>;
};

export const ProcessingStepper = ({
  steps,
  isActive,
  fastForward = false,
  onComplete,
}: ProcessingStepperProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const completedRef = useRef(false);

  const visibleSteps = steps.filter((s) => s.showIf !== false);
  const totalSteps = visibleSteps.length;

  // Reset on activation
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
      setIsCompleted(false);
      completedRef.current = false;
      setLoadingTextIndex(0);
    }
  }, [isActive]);

  // Rotate loading text
  useEffect(() => {
    if (!isActive || isCompleted) return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive, isCompleted]);

  // Step progression timer — advances through steps for visual interest but does NOT complete
  useEffect(() => {
    if (!isActive || isCompleted || currentStepIndex >= totalSteps) return;

    const step = visibleSteps[currentStepIndex];
    const duration = STEP_DURATIONS[step.id] ?? 1000;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, isCompleted, currentStepIndex, totalSteps, visibleSteps]);

  // When all steps have been traversed naturally, stop advancing and wait for fast-forward
  // (do NOT auto-complete — only fast-forward from API response triggers completion)
  const allStepsTraversed = isActive && currentStepIndex >= totalSteps;
  const isWaitingForApi = allStepsTraversed && !isCompleted;
  const isLastStepWaiting = isWaitingForApi;

  // Fast-forward when triggered by parent
  useEffect(() => {
    if (fastForward && isActive && !completedRef.current) {
      completedRef.current = true;
      setCurrentStepIndex(totalSteps);
      setIsCompleted(true);
    }
  }, [fastForward, isActive, totalSteps]);

  // Call onComplete when completed
  useEffect(() => {
    if (isCompleted && onComplete) {
      const timer = setTimeout(() => onComplete(), 400);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onComplete]);

  if (!isActive) return null;

  const progressPercent = totalSteps > 0
    ? Math.min(Math.round((currentStepIndex / totalSteps) * 100), 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <motion.div
                className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"
                animate={isCompleted ? { rotate: 0, scale: 1 } : { rotate: 360 }}
                transition={isCompleted ? { duration: 0.3 } : { repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </motion.div>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight">
                {isCompleted
                  ? 'Analysis Complete!'
                  : allStepsTraversed
                    ? 'Waiting for API response'
                    : LOADING_TEXTS[loadingTextIndex]}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isCompleted
                  ? 'Preparing your results...'
                  : allStepsTraversed
                    ? 'Finalizing analysis...'
                    : `Step ${Math.min(currentStepIndex + 1, totalSteps)} of ${totalSteps}`}
              </p>
            </div>
            {!isCompleted && (
              <motion.p
                className="ml-auto shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums"
                key={allStepsTraversed ? 'waiting' : progressPercent}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {allStepsTraversed ? '⏳' : `${progressPercent}%`}
              </motion.p>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative">
            <Progress
              value={isCompleted ? 100 : progressPercent}
              className="h-2 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-indigo-500 [&>[data-slot=progress-indicator]]:to-purple-500"
            />
          </div>

          <p className="text-xs text-muted-foreground text-center -mt-1">
            Usually takes 10–20 seconds <LoadingDots />
          </p>

          {/* Steps list */}
          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {visibleSteps.map((step, idx) => {
                const isLastStep = isLastStepWaiting && idx === totalSteps - 1;
                const stepCompleted = isCompleted || (idx < currentStepIndex && !isLastStep);
                const stepCurrent = !isCompleted && (
                  (!isWaitingForApi && idx === currentStepIndex) || isLastStep
                );

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.5) }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 transition-all duration-300',
                      stepCompleted
                        ? 'border-emerald-200/70 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-900/10'
                        : stepCurrent
                          ? 'border-indigo-200/70 bg-indigo-50/50 dark:border-indigo-800/30 dark:bg-indigo-900/10 shadow-sm'
                          : 'border-border/40 bg-card'
                    )}
                  >
                    {/* Status icon */}
                    <div
                      className={cn(
                        'flex shrink-0 items-center justify-center w-7 h-7 rounded-full transition-all duration-300',
                        stepCompleted
                          ? 'bg-emerald-500 text-white'
                          : stepCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-muted'
                      )}
                    >
                      {stepCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </motion.div>
                      ) : stepCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium leading-tight transition-colors',
                          stepCompleted
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : stepCurrent
                              ? 'text-indigo-700 dark:text-indigo-300'
                              : 'text-muted-foreground/50'
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground/70 truncate max-w-[280px] sm:max-w-md leading-tight mt-0.5">
                        {step.description}
                      </p>
                    </div>

                    {/* Pulse dot for current step */}
                    {stepCurrent && (
                      <span className="ml-auto shrink-0 flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                    {stepCompleted && !stepCurrent && (
                      <Check className="ml-auto shrink-0 w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProcessingStepper;
