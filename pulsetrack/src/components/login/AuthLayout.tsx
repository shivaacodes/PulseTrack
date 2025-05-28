import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative">
      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={mounted && theme === 'dark' ? "/images/Pulsetrack-dark.png" : "/images/Pulsetrack-light.png"}
            alt="PulseTrack Logo"
            width={320}
            height={85}
            className="h-16 w-auto"
            priority
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
        © 2025 Analytics Pro. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;
