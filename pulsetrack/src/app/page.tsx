"use client"

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthForm from "@/components/login/AuthForm";
import AuthLayout from "@/components/login/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <AuthLayout>
          <AuthForm />
        </AuthLayout>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;