'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('farmer@agrosarthi.in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Login failed. Please check credentials.');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', {
        isDemo: 'true',
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Demo login failed');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Demo login error');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8">
      {/* Old-School Windows / Portal Dialog Window */}
      <div className="bg-[#f4efe4] border-4 border-t-[#ffffff] border-l-[#ffffff] border-b-[#4a4539] border-r-[#4a4539] shadow-2xl p-1 text-[#222]">
        
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#144d29] via-[#1b5e34] to-[#2d7a46] text-[#fff] px-3 py-1.5 flex items-center justify-between font-bold text-sm tracking-wide shadow-sm">
          <div className="flex items-center gap-2">
            <span>🌾</span>
            <span className="font-serif">AgroSarthi Kisan Seva Portal — [User Login]</span>
          </div>
          <div className="flex gap-1 font-mono text-xs">
            <span className="px-1.5 bg-[#f4efe4] text-[#144d29] border border-[#144d29] cursor-default font-bold">_</span>
            <span className="px-1.5 bg-[#f4efe4] text-[#144d29] border border-[#144d29] cursor-default font-bold">□</span>
            <span className="px-1.5 bg-[#ba1c1c] text-[#fff] border border-[#ba1c1c] cursor-default font-bold">✕</span>
          </div>
        </div>

        {/* Notice Marquee Header */}
        <div className="bg-[#fff9db] border-b-2 border-[#d4af37] px-3 py-1 text-xs font-mono text-[#785400] flex items-center gap-2">
          <span className="font-bold uppercase bg-[#d4af37] text-white px-1.5 py-0.2">NOTICE:</span>
          <span className="truncate">Local Laptop Edition • Connected to Laptop MongoDB (sih131) • Zero API Key Mode Active</span>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#fbf9f4]">
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-[#c2b69d]">
            <h1 className="text-2xl font-bold font-serif text-[#144d29] tracking-tight">
              एग्रोसारथी किसान पोर्टल (AgroSarthi Portal)
            </h1>
            <p className="text-xs font-mono text-[#5c5446] mt-1">
              भारत सरकार • राष्ट्रीय कृषि डिजिटल निगरानी प्रणाली (SIH-2026 PS 131)
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#ffebee] border-2 border-[#d32f2f] text-[#c62828] text-xs font-mono">
              <strong>[त्रुटि / ERROR]:</strong> {error}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <fieldset className="border-2 border-[#9c8e77] p-4 bg-[#fff]">
              <legend className="px-2 font-serif text-sm font-bold text-[#144d29] bg-[#e8ded0] border border-[#9c8e77]">
                किसान लॉगिन विवरण (Farmer Credentials)
              </legend>

              <div className="space-y-3 pt-2 text-sm">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    ईमेल आईडी अथवा मोबाइल नंबर (Email / Phone):
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. farmer@agrosarthi.in or 9876543210"
                    className="w-full px-3 py-2 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                  <span className="text-[11px] text-[#7a6f5d] italic">
                    (Auto-registers if not yet created in your laptop MongoDB)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    पासवर्ड (Password):
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (optional for demo account)"
                    className="w-full px-3 py-2 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#144d29] hover:bg-[#1a5e33] active:bg-[#0d361c] text-[#fff] font-bold text-sm tracking-wide uppercase border-2 border-t-[#47915f] border-l-[#47915f] border-b-[#0a2715] border-r-[#0a2715] shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'प्रमाणीकरण हो रहा है... (Signing In...)' : '✔ पोर्टल में प्रवेश करें (Sign In)'}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#d97706] hover:bg-[#b45309] active:bg-[#78350f] text-[#fff] font-bold text-sm tracking-wide uppercase border-2 border-t-[#fbbf24] border-l-[#fbbf24] border-b-[#78350f] border-r-[#78350f] shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>त्वरित डेमो लॉगिन (1-Click Demo Login as Kisan Ram Kumar)</span>
              </button>
            </div>
          </form>

          {/* Links & Information */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#c2b69d] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            <Link
              href="/register"
              className="text-[#144d29] font-bold underline hover:text-[#d97706]"
            >
              📝 नया खाता बनाएं (New Farmer Registration)
            </Link>

            <Link
              href="/"
              className="text-[#5c5446] underline hover:text-[#111]"
            >
              ← मुख्य पृष्ठ पर वापस जाएं (Back to Home)
            </Link>
          </div>

          {/* Old-School Verification Status Stamp */}
          <div className="mt-6 bg-[#eae4d3] border border-[#beb39b] p-3 text-[11px] font-mono text-[#443d31] space-y-1">
            <div className="flex justify-between">
              <span>DATABASE HOST:</span>
              <strong className="text-[#144d29]">127.0.0.1:27017 (Laptop MongoDB)</strong>
            </div>
            <div className="flex justify-between">
              <span>DATABASE NAME:</span>
              <strong className="text-[#144d29]">sih131</strong>
            </div>
            <div className="flex justify-between">
              <span>AUTHENTICATION:</span>
              <strong>Local Credentials (Google OAuth Removed)</strong>
            </div>
            <div className="flex justify-between">
              <span>EXTERNAL API KEYS:</span>
              <strong className="text-[#144d29]">None Required (100% Free / Local Mode)</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
