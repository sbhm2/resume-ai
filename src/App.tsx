import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/AuthProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>

          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
