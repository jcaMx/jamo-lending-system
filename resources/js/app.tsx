import '../css/index.css'; // canonical stylesheet moved to resources/css/index.css

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob<{ default: React.ComponentType<any> }>('./pages/**/*.tsx', { eager: true });
    return pages[`./pages/${name}.tsx`]?.default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <App {...props} />
          </TooltipProvider>
        </QueryClientProvider>
      </StrictMode>
    );
  },
});

// Initialize light/dark theme
initializeTheme();
