'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    toast('Exited Demo Access', {
      description: "Returning to the landing page.",
    });
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white transition-colors rounded-none font-bold font-mono text-[10px] uppercase border-0 cursor-pointer"
    >
      <LogOut className="h-3 w-3" />
      <span className="hidden md:inline">Logout</span>
    </button>
  );
} 