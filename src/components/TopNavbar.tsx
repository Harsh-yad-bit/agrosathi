'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useLanguage } from '@/components/LanguageProvider';
import { navItems, NavItem } from '@/components/Sidebar';
import { Leaf, Globe, User, Bell, Cloud, Activity, CheckCircle, ShieldAlert, Clock, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type AlertType = 'disease' | 'weather' | 'health';

interface Alert {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    type: "disease",
    title: "High Disease Risk Alert",
    message: "Late blight risk is elevated for tomato and potato crops in your district.",
    time: "10 min ago",
    unread: true
  },
  {
    id: 2,
    type: "weather",
    title: "Weather Advisory",
    message: "Moderate rain predicted. Hold off chemical spraying for 24 hours.",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    type: "health",
    title: "Laptop MongoDB Synced",
    message: "Farm profile & scan logs persisted to mongodb://127.0.0.1:27017/sih131.",
    time: "Today",
    unread: false
  }
];

export default function TopNavbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { data: session } = useSession();

  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');

  const unreadCount = alerts.filter(a => a.unread).length;

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, unread: false })));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="w-full bg-[#f4efe4] border-b-4 border-[#3e392d] shadow-md z-50 text-[#1a1a1a]">
      {/* 1. Official Top Portal Masthead */}
      <div className="bg-gradient-to-r from-[#144d29] via-[#1a5c32] to-[#257340] text-white px-4 py-2 border-b-2 border-[#d4af37]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          
          {/* Logo & National/Kisan Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#fff] border-2 border-[#d4af37] flex items-center justify-center text-[#144d29] font-bold text-lg shadow-sm">
              🌾
            </div>
            <div>
              <div className="font-bold tracking-wider font-serif text-sm sm:text-base text-[#fffae6]">
                एग्रोसारथी किसान सेवा पोर्टल
              </div>
              <div className="text-[10px] text-[#c9e6d2] font-mono tracking-tight">
                AGROSARTHI KISAN SEVA PORTAL • NATIONAL AGRI-INTELLIGENCE (SIH-2026)
              </div>
            </div>
          </div>

          {/* Right Status Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="bg-[#0b331a] px-2 py-0.5 border border-[#3e8556] text-[#69f0ae]">
              ● LAPTOP DB: 127.0.0.1:27017 (sih131)
            </span>
            <span className="bg-[#b45309] px-2 py-0.5 border border-[#fbbf24] text-[#fff] font-bold">
              ★ ZERO-API-KEY MODE
            </span>
            <span className="hidden md:inline bg-[#1b4332] px-2 py-0.5 border border-[#3e8556] text-[#e8f5e9]">
              ⏰ {currentTime || 'Loading...'}
            </span>
          </div>

        </div>
      </div>

      {/* 2. Vintage Marquee Ticker */}
      <div className="bg-[#fff9db] border-b border-[#c2b69d] px-3 py-1 flex items-center gap-2 overflow-hidden text-xs font-mono text-[#664d03]">
        <span className="font-bold uppercase bg-[#d97706] text-white px-1.5 py-0.2 shrink-0">
          ताज़ा सूचना (BULLETIN):
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee font-bold">
            🌾 किसान सूचना: फसल रोग पहचान के लिए फोटो अपलोड करें • मौसम पूर्वानुमान बिना किसी API key के लाइव उपलब्ध है • आपका डेटा स्थानीय लैपटॉप MongoDB (127.0.0.1:27017/sih131) में सुरक्षित संग्रहित हो रहा है • किसान सहायता नंबर: 1800-180-1551
          </div>
        </div>
      </div>

      {/* 3. Old-School Beveled Navigation Bar */}
      <div className="bg-[#ebe4d5] px-4 py-2 flex items-center justify-between border-t border-[#fff] border-b-2 border-[#948773]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Desktop Nav Items with Raised 3D Button Style */}
          <nav className="hidden lg:flex items-center gap-1.5 flex-wrap">
            <Link
              href="/"
              className={`px-3 py-1.5 text-xs font-bold font-serif uppercase tracking-wider border-2 transition-all ${
                pathname === '/'
                  ? 'border-t-[#333] border-l-[#333] border-b-[#fff] border-r-[#fff] bg-[#144d29] text-white'
                  : 'border-t-[#fff] border-l-[#fff] border-b-[#776c5b] border-r-[#776c5b] bg-[#ded5c2] hover:bg-[#eae2cf] text-[#222]'
              }`}
            >
              🏠 गृह (Home)
            </Link>

            {navItems.map((item: NavItem) => {
              const active = isActive(item.href);
              const labelMap: Record<string, string> = {
                Dashboard: '📊 डैशबोर्ड (Dashboard)',
                Scan: '🔬 फसल डॉक्टर (Scan)',
                Farm: '🚜 मेरा खेत (Farm)',
                Timeline: '📜 इतिहास (Timeline)',
                Weather: '🌦️ मौसम (Weather)',
                Assistant: '💬 किसान सलाहकार (AI)',
                Schemes: '🏛️ योजनाएं (Schemes)',
                Settings: '⚙️ सेटिंग्स (Settings)',
              };

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 text-xs font-bold font-serif tracking-tight border-2 transition-all ${
                    active
                      ? 'border-t-[#333] border-l-[#333] border-b-[#fff] border-r-[#fff] bg-[#144d29] text-white shadow-inner'
                      : 'border-t-[#fff] border-l-[#fff] border-b-[#776c5b] border-r-[#776c5b] bg-[#ded5c2] hover:bg-[#eae2cf] text-[#222]'
                  }`}
                >
                  {labelMap[item.key] || item.key}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-3 py-1 bg-[#ded5c2] border-2 border-t-[#fff] border-l-[#fff] border-b-[#776c5b] border-r-[#776c5b] text-xs font-bold flex items-center gap-1"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>मेनू (MENU)</span>
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-2.5 py-1 bg-[#ded5c2] hover:bg-[#eae2cf] active:translate-y-0.5 border-2 border-t-[#fff] border-l-[#fff] border-b-[#776c5b] border-r-[#776c5b] text-xs font-bold flex items-center gap-1"
                title="Notifications"
              >
                <Bell size={14} className="text-[#144d29]" />
                <span className="hidden sm:inline">अलर्ट</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#ba1c1c] text-white text-[10px] font-bold rounded-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#fbf9f4] border-3 border-t-[#fff] border-l-[#fff] border-b-[#443d31] border-r-[#443d31] shadow-2xl z-50 p-2 text-[#222]">
                  <div className="bg-[#144d29] text-white px-3 py-1 font-bold text-xs flex justify-between items-center font-serif">
                    <span>सूचनाएं (Notifications)</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] underline text-[#a3e635]">
                        सब पढ़ें
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#d4c8b4] text-xs font-mono p-1">
                    {alerts.map(a => (
                      <div key={a.id} className="py-2 px-1">
                        <div className="font-bold text-[#144d29] flex justify-between">
                          <span>{a.title}</span>
                          <span className="text-[10px] text-[#6b6251]">{a.time}</span>
                        </div>
                        <p className="text-[#333] text-[11px] mt-0.5">{a.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 bg-[#ded5c2] hover:bg-[#eae2cf] active:translate-y-0.5 border-2 border-t-[#fff] border-l-[#fff] border-b-[#776c5b] border-r-[#776c5b] text-xs font-bold flex items-center gap-1"
            >
              <Globe size={14} className="text-[#144d29]" />
              <span>{language === 'en' ? 'हिंदी में' : 'English'}</span>
            </button>

            {/* Auth Buttons */}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-2.5 py-1 bg-[#ba1c1c] text-white hover:bg-[#991515] active:translate-y-0.5 border-2 border-t-[#f87171] border-l-[#f87171] border-b-[#500707] border-r-[#500707] text-xs font-bold"
              >
                लॉगआउट (Logout)
              </button>
            ) : (
              <div className="flex gap-1.5">
                <Link
                  href="/login"
                  className="px-2.5 py-1 bg-[#144d29] text-white hover:bg-[#1a5c32] active:translate-y-0.5 border-2 border-t-[#4ade80] border-l-[#4ade80] border-b-[#052e16] border-r-[#052e16] text-xs font-bold"
                >
                  लॉगिन (Login)
                </Link>
                <Link
                  href="/register"
                  className="px-2.5 py-1 bg-[#d97706] text-white hover:bg-[#b45309] active:translate-y-0.5 border-2 border-t-[#fbbf24] border-l-[#fbbf24] border-b-[#78350f] border-r-[#78350f] text-xs font-bold"
                >
                  पंजीकरण (Register)
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f4efe4] border-b-4 border-[#3e392d] p-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 border border-[#b8ac99] font-bold text-xs bg-[#ded5c2]"
          >
            🏠 गृह (Home)
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 border border-[#b8ac99] font-bold text-xs bg-[#fff]"
            >
              {item.key}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
