import '../css/app.css'; // ✅ your golden/orange theme

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from './hooks/use-appearance';
import LoanApplication from "./pages/BorrowerApplication";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from 'lucide-react';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
    return pages[`./pages/${name}.tsx`];
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
