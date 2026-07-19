import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-card py-4 px-6 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground/70">© 2026 NextOffer</p>
        
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms
          </Link>
          <a 
            href="https://nextoffer.co.in" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
          >
            nextoffer.co.in
          </a>
        </div>
      </div>
    </footer>
  );
};