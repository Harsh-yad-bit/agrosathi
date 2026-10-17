'use client';

import TopNavbar from '@/components/TopNavbar';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If unauthenticated and on a protected page, redirect to login
      if (!session && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
        router.push('/login');
      }
      // If already authenticated and on login/register, go to dashboard
      if (session && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [session, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f4] text-[#144d29]">
        <div className="bg-[#ede6d8] border-3 border-t-[#fff] border-l-[#fff] border-b-[#5c5446] border-r-[#5c5446] p-6 text-center font-serif shadow-lg">
          <div className="text-3xl mb-2 animate-bounce">🌾</div>
          <div className="font-bold text-base">एग्रोसारथी पोर्टल लोड हो रहा है...</div>
          <div className="text-xs font-mono text-[#665c4e] mt-1">
            Loading AgroSarthi Local Portal (Connecting 127.0.0.1:27017)...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4] text-[#1c261e]">
      {/* Universal Old-School Portal Header */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 overflow-x-hidden">
        {children}
      </main>

      {/* Universal Old-School Portal Footer */}
      <footer className="w-full bg-[#ebe4d5] border-t-4 border-[#3e392d] py-6 px-4 text-center text-xs text-[#443d31]">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="font-serif font-bold text-sm text-[#144d29]">
            🇮🇳 राष्ट्रीय कृषि डिजिटल निगरानी एवं फसल सुरक्षा प्रणाली (AgroSarthi AI - PS 131)
          </div>
          <div className="text-[11px] font-mono text-[#665c4e] flex flex-wrap justify-center gap-4">
            <span>डेटाबेस: <strong>Laptop MongoDB (mongodb://127.0.0.1:27017/sih131)</strong></span>
            <span>|</span>
            <span>API कुंजी: <strong>Zero-API-Key Mode (Not Required)</strong></span>
            <span>|</span>
            <span>किसान कॉल सेंटर: <strong>1800-180-1551 (टोल फ्री)</strong></span>
          </div>
          <div className="text-[10px] text-[#7d7260] pt-2 border-t border-[#d4c8b4] font-mono">
            AgroSarthi Local Edition • Smart India Hackathon Prototype • Best viewed in all standard web browsers
          </div>
        </div>
      </footer>
    </div>
  );
}
