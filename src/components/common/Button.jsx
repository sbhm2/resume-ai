import { cn } from '../../utils/cn';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-black/90",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-border bg-transparent hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};