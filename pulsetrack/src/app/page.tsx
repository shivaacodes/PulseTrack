"use client"

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/components/login/AuthPage";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;