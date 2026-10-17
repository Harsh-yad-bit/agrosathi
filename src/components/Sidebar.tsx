'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Camera,
  User,
  Clock,
  Cloud,
  MessageCircle,
  Settings,
  Leaf,
  Menu,
  X,
  Globe,
  Landmark,
} from 'lucide-react';
import { useState } from 'react';

export const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'Dashboard' as const },
  { href: '/scan', icon: Camera, key: 'Scan' as const },
  { href: '/farm', icon: User, key: 'Farm' as const },
  { href: '/timeline', icon: Clock, key: 'Timeline' as const },
  { href: '/weather', icon: Cloud, key: 'Weather' as const },
  { href: '/assistant', icon: MessageCircle, key: 'Assistant' as const },
  { href: '/schemes', icon: Landmark, key: 'Schemes' as const },
  { href: '/settings', icon: Settings, key: 'Settings' as const },
];

export type NavItem = {
  href: string;
  icon: any;
  key: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#144d29] text-white p-2 border-2 border-[#fff] shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#ede6d8] text-[#1c261e] border-r-4 border-[#3e392d] z-40 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto flex flex-col font-serif`}
      >
        {/* Logo Header */}
        <div className="p-4 bg-[#144d29] text-white border-b-2 border-[#d4af37]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 bg-white border border-[#d4af37] flex items-center justify-center text-base">
              🌾
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">एग्रोसारथी (AgroSarthi)</h1>
              <p className="text-[10px] text-[#c9e6d2] font-mono">किसान सेवा पोर्टल</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-sans text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 border-2 transition-all font-bold ${
                  isActive
                    ? 'bg-[#144d29] text-white border-t-[#0a2715] border-l-[#0a2715] border-b-[#47915f] border-r-[#47915f]'
                    : 'bg-[#f4efe4] hover:bg-[#fff] text-[#222] border-t-[#fff] border-l-[#fff] border-b-[#8c8273] border-r-[#8c8273]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-[#144d29]'} />
                <span>{item.key}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t-2 border-[#b8ac99] bg-[#e2dac9] space-y-2 text-xs font-sans">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#f4efe4] hover:bg-[#fff] border-2 border-t-[#fff] border-l-[#fff] border-b-[#8c8273] border-r-[#8c8273] font-bold text-[#144d29]"
          >
            <Globe size={16} />
            <span>{language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#ba1c1c] text-white hover:bg-[#991515] border-2 border-t-[#f87171] border-l-[#f87171] border-b-[#500707] border-r-[#500707] font-bold"
          >
            <User size={16} />
            <span>लॉगआउट (Logout)</span>
          </button>

          <div className="text-[10px] text-[#6b6251] font-mono text-center pt-2">
            <div>MongoDB: 127.0.0.1:27017</div>
            <div>Zero-API-Key Active</div>
          </div>
        </div>
      </aside>
    </>
  );
}
