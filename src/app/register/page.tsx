'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Gharaunda',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Automatically sign in
      const loginRes = await signIn('credentials', {
        identifier: formData.email || formData.phone,
        password: formData.password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Error creating farmer account');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {/* Old-School Windows / Portal Dialog Window */}
      <div className="bg-[#f4efe4] border-4 border-t-[#ffffff] border-l-[#ffffff] border-b-[#4a4539] border-r-[#4a4539] shadow-2xl p-1 text-[#222]">
        
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#144d29] via-[#1b5e34] to-[#2d7a46] text-[#fff] px-3 py-1.5 flex items-center justify-between font-bold text-sm tracking-wide shadow-sm">
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <span className="font-serif">AgroSarthi Kisan Seva Portal — [New Farmer Registration Form]</span>
          </div>
          <div className="flex gap-1 font-mono text-xs">
            <span className="px-1.5 bg-[#f4efe4] text-[#144d29] border border-[#144d29] cursor-default font-bold">_</span>
            <span className="px-1.5 bg-[#f4efe4] text-[#144d29] border border-[#144d29] cursor-default font-bold">□</span>
            <span className="px-1.5 bg-[#ba1c1c] text-[#fff] border border-[#ba1c1c] cursor-default font-bold">✕</span>
          </div>
        </div>

        {/* Notice Marquee Header */}
        <div className="bg-[#fff9db] border-b-2 border-[#d4af37] px-3 py-1 text-xs font-mono text-[#785400] flex items-center gap-2">
          <span className="font-bold uppercase bg-[#d4af37] text-white px-1.5 py-0.2">FORM 1-A:</span>
          <span className="truncate">Local Laptop Registration • Persisted directly into Laptop MongoDB (sih131)</span>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#fbf9f4]">
          <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-[#c2b69d]">
            <h1 className="text-2xl font-bold font-serif text-[#144d29] tracking-tight">
              नया किसान पंजीकरण (Farmer Enrollment)
            </h1>
            <p className="text-xs font-mono text-[#5c5446] mt-1">
              राष्ट्रीय डिजिटल कृषि मंच • अपनी फसल सुरक्षा एवं निगरानी खाता बनाएं
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#ffebee] border-2 border-[#d32f2f] text-[#c62828] text-xs font-mono">
              <strong>[त्रुटि / ERROR]:</strong> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Personal Details */}
            <fieldset className="border-2 border-[#9c8e77] p-4 bg-[#fff]">
              <legend className="px-2 font-serif text-sm font-bold text-[#144d29] bg-[#e8ded0] border border-[#9c8e77]">
                1. व्यक्तिगत जानकारी (Personal Details)
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    किसान का पूरा नाम (Full Name) *:
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Chandra Yadav"
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    मोबाइल नंबर (Phone Number) *:
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    ईमेल आईडी (Email ID - Optional):
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@farm.in"
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    पासवर्ड बनाएं (Create Password):
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (optional)"
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Farm Location */}
            <fieldset className="border-2 border-[#9c8e77] p-4 bg-[#fff]">
              <legend className="px-2 font-serif text-sm font-bold text-[#144d29] bg-[#e8ded0] border border-[#9c8e77]">
                2. खेत का स्थान (Farm Location Details)
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    राज्य (State):
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    जिला (District):
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#3d382f] mb-1">
                    गांव / कस्बा (Village):
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border-2 border-t-[#5c5446] border-l-[#5c5446] border-b-[#e8ded0] border-r-[#e8ded0] bg-[#fff] text-[#111] font-mono text-sm focus:outline-none focus:bg-[#fffae6]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#144d29] hover:bg-[#1a5e33] active:bg-[#0d361c] text-[#fff] font-bold text-sm tracking-wide uppercase border-2 border-t-[#47915f] border-l-[#47915f] border-b-[#0a2715] border-r-[#0a2715] shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'पंजीकरण हो रहा है... (Submitting Registration...)' : '✔ खाता बनाएं और लॉगिन करें (Register & Log In)'}
              </button>
            </div>
          </form>

          {/* Links & Information */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#c2b69d] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            <Link
              href="/login"
              className="text-[#144d29] font-bold underline hover:text-[#d97706]"
            >
              ← पहले से खाता है? यहाँ लॉगिन करें (Already Registered? Log In)
            </Link>

            <Link
              href="/"
              className="text-[#5c5446] underline hover:text-[#111]"
            >
              मुख्य पृष्ठ (Home)
            </Link>
          </div>

          {/* Old-School Verification Stamp */}
          <div className="mt-6 bg-[#eae4d3] border border-[#beb39b] p-3 text-[11px] font-mono text-[#443d31] space-y-1">
            <div className="flex justify-between">
              <span>STORAGE DESTINATION:</span>
              <strong className="text-[#144d29]">Local Laptop MongoDB &gt; sih131.farmers</strong>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <strong>Direct Local Verification (No External OAuth Required)</strong>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
