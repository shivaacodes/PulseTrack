import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Animated gradient orb */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl animate-float opacity-40"></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-secondary/20 filter blur-3xl animate-float opacity-30"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-accent/20 filter blur-3xl animate-float opacity-30"
          style={{ animationDelay: "-4s" }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/images/PulseTrack.png"
            alt="PulseTrack Logo"
            width={320}
            height={85}
            className="h-16 w-auto"
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg">{children}</div>

      {/* Footer */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
        © 2025 Analytics Pro. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;
