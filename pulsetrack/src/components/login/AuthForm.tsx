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
        throw new Error('Please enter both email and password');
      }

      const response = await login(email, password);
      
      if (response && response.user_id) {
        toast({
          title: "Welcome back! 👋",
          description: "Successfully logged in to your dashboard.",
        });
        
        router.replace(response.redirect_url || `/dashboard?user_id=${response.user_id}`);
      } else {
        throw new Error('Unable to log in. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = "Unable to log in. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid credentials")) {
          errorMessage = "Incorrect email or password. Please try again.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "No account found with this email. Please sign up.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        }
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
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

      if (!email || !password || !fullName) {
        throw new Error('Please fill in all fields');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await register(email, password, fullName);
      toast({
        title: "Account Created! 🎉",
        description: "Your account has been created successfully. You can now log in.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = "Unable to create account. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Email already exists")) {
          errorMessage = "An account with this email already exists. Please log in.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes("Password")) {
          errorMessage = "Password must be at least 6 characters long.";
        }
      }

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
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

          <CardContent>
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
