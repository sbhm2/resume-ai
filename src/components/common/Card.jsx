import { cn } from '../../utils/cn';

export const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-surface border border-border rounded-xl shadow-saas overflow-hidden", className)}>
      {children}
    </div>
  );
};