import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';

// 1. Create a client instance
// You can configure global defaults here (like retry logic or cache time)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when user switches browser tabs
      retry: 1, // Only retry failed requests once
    },
  },
});

function App() {
  return (
    // 2. Wrap your application with the provider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;