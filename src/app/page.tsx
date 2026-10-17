'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Leaf, Camera, Cloud, Clock, MessageCircle, Landmark, ShieldAlert, CheckCircle, Bell, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      
      {/* 1. Portal Welcome Masthead */}
      <div className="bg-[#ede6d8] border-3 border-t-[#ffffff] border-l-[#ffffff] border-b-[#4a4539] border-r-[#4a4539] p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-[#144d29] border-2 border-[#d4af37] flex items-center justify-center text-white text-3xl shadow-inner shrink-0">
              🌾
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#b45309] uppercase tracking-widest">
                ★ SIH 2026 PS 131 • राष्ट्रीय किसान सूचना तंत्र ★
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#144d29] tracking-tight">
                एग्रोसारथी किसान सेवा पोर्टल (AgroSarthi Portal)
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#4a4234] mt-0.5">
                फसल स्वास्थ्य निदान, रोग पहचान, लाइव मौसम सलाह एवं सरकारी योजनाओं का केंद्रीय डिजिटल मंच
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-[#144d29] hover:bg-[#1b6335] active:translate-y-0.5 text-white font-bold font-serif text-sm text-center border-2 border-t-[#47915f] border-l-[#47915f] border-b-[#0b2b17] border-r-[#0b2b17] shadow-md uppercase tracking-wider"
              >
                📊 डैशबोर्ड खोलें (Open Dashboard)
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 bg-[#144d29] hover:bg-[#1b6335] active:translate-y-0.5 text-white font-bold font-serif text-sm text-center border-2 border-t-[#47915f] border-l-[#47915f] border-b-[#0b2b17] border-r-[#0b2b17] shadow-md uppercase tracking-wider"
                >
                  🔑 किसान लॉगिन (Log In)
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 bg-[#d97706] hover:bg-[#b45309] active:translate-y-0.5 text-white font-bold font-serif text-sm text-center border-2 border-t-[#fbbf24] border-l-[#fbbf24] border-b-[#78350f] border-r-[#78350f] shadow-md uppercase tracking-wider"
                >
                  📝 नया पंजीकरण (Register)
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Three-Column Classic Portal Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Services Desk (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#fff] border-3 border-t-[#fff] border-l-[#fff] border-b-[#5c5446] border-r-[#5c5446] shadow-sm">
            <div className="bg-[#144d29] text-white px-3 py-2 font-serif font-bold text-sm flex items-center justify-between border-b-2 border-[#d4af37]">
              <span>🚜 त्वरित सेवाएं (Quick Services)</span>
              <span className="text-[10px] font-mono bg-[#0b2b17] px-1.5 py-0.5 border border-[#3e8556]">06 SERVICES</span>
            </div>
            
            <div className="p-3 space-y-2 text-xs font-serif font-bold">
              <Link
                href="/scan"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#144d29] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🔬
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">फसल डॉक्टर (Crop Doctor)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">पत्ती की फोटो से तुरंत रोग जांचें</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#1e40af] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  📊
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">किसान डैशबोर्ड (Dashboard)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">फसल स्थिति एवं लाइव मैट्रिक्स</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/weather"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🌦️
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">मौसम एवं छिड़काव समय (Weather)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">वर्षा जोखिम एवं स्प्रे विंडो</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/assistant"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#059669] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  💬
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">किसान एआई सलाहकार (Advisor)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">जैविक व रासायनिक उपचार सलाह</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/schemes"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#b45309] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🏛️
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">सरकारी कृषि योजनाएं (Schemes)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">PM-KISAN, PMFBY, सब्सिडी</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/farm"
                className="flex items-center gap-3 p-2.5 bg-[#fbf9f4] hover:bg-[#f0ece1] border border-[#d6ccbe] text-[#144d29] hover:border-[#144d29] transition-all group"
              >
                <div className="w-8 h-8 rounded bg-[#7c2d12] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🌱
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">मेरा खेत एवं फसल (Farm Profile)</div>
                  <div className="text-[11px] text-[#665c4e] font-sans font-normal">भूमि क्षेत्रफल एवं फसल विवरण</div>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Column: Agricultural Notice & Live Bulletin (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fff] border-3 border-t-[#fff] border-l-[#fff] border-b-[#5c5446] border-r-[#5c5446] shadow-sm">
            <div className="bg-[#b45309] text-white px-3 py-2 font-serif font-bold text-sm flex items-center justify-between border-b-2 border-[#fbbf24]">
              <span>📢 दैनिक कृषि बुलेटिन (Agro Bulletin Board)</span>
              <span className="text-[10px] font-mono bg-[#78350f] px-1.5 py-0.5 border border-[#fbbf24]">OCT 2026</span>
            </div>

            <div className="p-4 space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#fff8e6] border-l-4 border-[#d97706] text-[#451a03]">
                <div className="font-bold font-serif text-sm flex items-center gap-1.5 text-[#b45309]">
                  <span>⚠️</span> झुलसा एवं कवक रोग चेतावनी (Blight Alert)
                </div>
                <p className="mt-1 leading-relaxed">
                  अधिक आर्द्रता और 25°-32°C तापमान में टमाटर एवं आलू की फसल में पछेती व अगेती झुलसा का प्रकोप बढ़ सकता है। खेत में जलभराव न होने दें एवं लक्षण दिखते ही मैनकोज़ेब या नीम तेल का छिड़काव करें।
                </p>
              </div>

              <div className="p-3 bg-[#f0fdf4] border-l-4 border-[#16a34a] text-[#14532d]">
                <div className="font-bold font-serif text-sm flex items-center gap-1.5 text-[#15803d]">
                  <span>🌧️</span> मौसम अनुकूलता नियम (Weather Protocol)
                </div>
                <p className="mt-1 leading-relaxed">
                  बिना किसी बाह्य API कुंजी के लाइव मौसम पूर्वानुमान चालू है। यदि बारिश की संभावना 50% से अधिक हो तो रासायनिक स्प्रे न करें ताकि दवा बह न जाए।
                </p>
              </div>

              <div className="p-3 bg-[#f0f9ff] border-l-4 border-[#0284c7] text-[#0c4a6e]">
                <div className="font-bold font-serif text-sm flex items-center gap-1.5 text-[#0369a1]">
                  <span>💡</span> पोषण प्रबंधन टिप (Nutrient Tip)
                </div>
                <p className="mt-1 leading-relaxed">
                  गेहूं एवं रबी फसलों में पहली सिंचाई (CRI अवस्था, बुवाई के 21 दिन बाद) पर 35-40 किग्रा नीम लेपित यूरिया का छिड़काव सर्वोत्तम कल्ले फूटने में सहायक होता है।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Local Database & System Status (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#ede6d8] border-3 border-t-[#fff] border-l-[#fff] border-b-[#5c5446] border-r-[#5c5446] shadow-sm p-3">
            <div className="bg-[#144d29] text-white px-2.5 py-1.5 font-serif font-bold text-xs border border-[#d4af37] text-center uppercase tracking-wider">
              लैपटॉप सिस्टम स्थिति (System Status)
            </div>

            <div className="mt-3 space-y-2 text-[11px] font-mono text-[#332e27]">
              <div className="bg-[#fff] p-2 border border-[#b8ac99]">
                <span className="block text-[#776c5b] text-[10px]">DATABASE HOST:</span>
                <strong className="text-[#144d29]">127.0.0.1:27017</strong>
              </div>

              <div className="bg-[#fff] p-2 border border-[#b8ac99]">
                <span className="block text-[#776c5b] text-[10px]">DATABASE NAME:</span>
                <strong className="text-[#144d29]">sih131</strong>
              </div>

              <div className="bg-[#fff] p-2 border border-[#b8ac99]">
                <span className="block text-[#776c5b] text-[10px]">AUTH MECHANISM:</span>
                <strong className="text-[#144d29]">Laptop Credentials (No Google OAuth)</strong>
              </div>

              <div className="bg-[#fff] p-2 border border-[#b8ac99]">
                <span className="block text-[#776c5b] text-[10px]">API KEY STATUS:</span>
                <strong className="text-[#b45309]">ZERO-API-KEY MODE (Active)</strong>
              </div>
            </div>

            {/* Retro Visitor Counter */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#b8ac99] text-center">
              <span className="text-[10px] font-mono text-[#5c5446] uppercase font-bold block mb-1">
                आगंतुक संख्या (Visitor Counter)
              </span>
              <div className="inline-flex bg-[#000] text-[#4ade80] font-mono text-sm px-2 py-0.5 border border-[#333] tracking-widest font-bold">
                0 0 5 8 9 2
              </div>
            </div>

            {/* Helpline Badge */}
            <div className="mt-4 p-2 bg-[#dcfce7] border border-[#86efac] text-center text-xs font-serif font-bold text-[#14532d]">
              📞 किसान सहायता नंबर<br />
              <span className="text-sm font-mono text-[#15803d]">1800-180-1551</span>
              <span className="block text-[10px] font-normal text-[#166534]">(टोल फ्री • सुबह 6 से रात 10)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Old-School Comparison Table */}
      <div className="bg-[#fff] border-3 border-t-[#fff] border-l-[#fff] border-b-[#5c5446] border-r-[#5c5446] p-4 shadow-sm">
        <div className="font-serif font-bold text-lg text-[#144d29] pb-2 border-b-2 border-[#144d29] mb-3">
          तालिका 1.1: पारंपरिक कृषि पद्धति बनाम एग्रोसारथी डिजिटल प्रणाली
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-[#ede6d8] border-2 border-[#5c5446] text-[#144d29] font-serif">
                <th className="p-2 border border-[#b8ac99] font-bold">पैरामीटर (Parameter)</th>
                <th className="p-2 border border-[#b8ac99] font-bold">पारंपरिक तरीका (Traditional)</th>
                <th className="p-2 border border-[#b8ac99] font-bold">एग्रोसारथी प्रणाली (AgroSarthi Platform)</th>
                <th className="p-2 border border-[#b8ac99] font-bold">किसान को सीधा लाभ (Direct Benefit)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-[#b8ac99] hover:bg-[#faf8f2]">
                <td className="p-2 border border-[#b8ac99] font-bold font-serif">रोग पहचान (Disease Detection)</td>
                <td className="p-2 border border-[#b8ac99]">अंदाजे से या दुकान पर पत्ती ले जाकर</td>
                <td className="p-2 border border-[#b8ac99] text-[#15803d] font-bold">मोबाइल कैमरे से तुरंत कंप्यूटर विज़न द्वारा जांच</td>
                <td className="p-2 border border-[#b8ac99]">रोग का 95%+ सटीक व प्रारंभिक निदान</td>
              </tr>
              <tr className="border border-[#b8ac99] bg-[#fdfbf7] hover:bg-[#faf8f2]">
                <td className="p-2 border border-[#b8ac99] font-bold font-serif">मौसम एवं स्प्रे विंडो</td>
                <td className="p-2 border border-[#b8ac99]">स्प्रे के बाद बारिश में दवा धुल जाना</td>
                <td className="p-2 border border-[#b8ac99] text-[#15803d] font-bold">मौसम आधारित जोखिम इंडेक्स व स्प्रे विंडो</td>
                <td className="p-2 border border-[#b8ac99]">कीटनाशक व लागत की 40% तक बचत</td>
              </tr>
              <tr className="border border-[#b8ac99] hover:bg-[#faf8f2]">
                <td className="p-2 border border-[#b8ac99] font-bold font-serif">डेटाबेस एवं प्राइवेसी</td>
                <td className="p-2 border border-[#b8ac99]">क्लाउड निर्भरता या डेटा खोना</td>
                <td className="p-2 border border-[#b8ac99] text-[#15803d] font-bold">लोकल लैपटॉप MongoDB (127.0.0.1:27017)</td>
                <td className="p-2 border border-[#b8ac99]">100% डेटा सुरक्षा व बिना इंटरनेट एक्सेस</td>
              </tr>
              <tr className="border border-[#b8ac99] bg-[#fdfbf7] hover:bg-[#faf8f2]">
                <td className="p-2 border border-[#b8ac99] font-bold font-serif">API कुंजी अनिवार्यता</td>
                <td className="p-2 border border-[#b8ac99]">महंगे सशुल्क API पर निर्भर</td>
                <td className="p-2 border border-[#b8ac99] text-[#15803d] font-bold">Zero-API-Key Mode (मुफ्त व स्थानीय इंजन)</td>
                <td className="p-2 border border-[#b8ac99]">शून्य अतिरिक्त लागत</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
