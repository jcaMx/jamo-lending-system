import '../css/index.css'; // canonical stylesheet moved to resources/css/index.css

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from './hooks/use-appearance';
import LoanApplication from "./pages/BorrowerApplication";
import { Home } from 'lucide-react';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createInertiaApp({
  resolve: name => {
    console.log('🔍 Inertia resolving:', name);
    const pages = import.meta.glob<{ default: React.ComponentType<any> }>('./pages/**/*.tsx', { eager: true });

      // Try exact match first
  const exactPath = `./pages/${name}.tsx`;
  if (pages[exactPath]) {
    console.log('✅ Page resolved (exact):', exactPath);
    return pages[exactPath].default;
  }
  
  // Try case-insensitive match
  const normalizedName = name.toLowerCase();
  const foundKey = Object.keys(pages).find(key => 
    key.toLowerCase() === exactPath.toLowerCase()
  );
  
  if (foundKey) {
    console.log('✅ Page resolved (case-insensitive):', foundKey);
    return pages[foundKey].default;
  }
  
  console.error('❌ Page not found:', exactPath);
  console.log('Available pages:', Object.keys(pages));
  throw new Error(`Inertia page not found: ${name}`);
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
