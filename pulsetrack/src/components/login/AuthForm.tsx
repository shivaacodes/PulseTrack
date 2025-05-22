"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const { toast } = useToast();
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await login(email, password);
      
      if (response && response.user_id) {
        toast({
          title: "Login successful!",
          description: "Welcome back to your dashboard.",
        });
        
        // Use replace instead of push to prevent back navigation to login
        router.replace(`/dashboard?user_id=${response.user_id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const fullName = formData.get('fullName') as string;

      // Validate required fields
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await register(email, password, fullName);
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-md border border-border/20 shadow-xl">
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Analytics Pro
              </CardTitle>
              <TabsList className="grid grid-cols-2 w-[240px] bg-muted/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-background">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background">Sign Up</TabsTrigger>
              </TabsList>
            </div>
            <CardDescription className="text-center text-muted-foreground/80">
              Access your dashboard analytics in one place
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="pl-10 pr-10 h-11 bg-background/50 focus:bg-background transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Full Name"
                      type="text"
                      name="fullName"
                      className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Password"
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      className="pl-10 pr-10 h-11 bg-background/50 focus:bg-background transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-3 text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </>
  );
};

export default AuthForm;
