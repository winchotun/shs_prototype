import React from 'react';
import { Product } from '../types';

interface HomepageScreenProps {
  products: Product[];
  onShowToast: (title: string, message: string) => void;
}

export const HomepageScreen: React.FC<HomepageScreenProps> = ({ products, onShowToast }) => {
  return (
    <div className="px-4 sm:px-6 py-5 space-y-6 max-w-[1440px] mx-auto w-full">
      {/* Top Banner Control */}
      <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2c3f8f]"></span>
            <span className="text-[0.72rem] font-bold uppercase text-[#5a5f78] tracking-wider">
              Storefront Preview & CMS
            </span>
          </div>
          <h1 className="text-[1.375rem] font-bold text-[#1a1d2e] font-display">
            ရွှေနှင်းဆီ ပါတိတ် · Customer Homepage ဒီဇိုင်း
          </h1>
          <p className="text-[0.84375rem] text-[#5a5f78] mt-0.5">
            ဝယ်ယူသူများ မြင်တွေ့ရမည့် လက်မှုပါတိတ် အွန်လိုင်းစတိုးရှေ့မျက်နှာစာနှင့် ကြော်ငြာဒီဇိုင်း
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onShowToast('Banner သိမ်းဆည်းပြီး', 'Homepage Hero Banner အသစ်ကို စတိုးမျက်နှာစာတွင် ထုတ်ဝေလိုက်ပါပြီ။')}
            className="px-4 py-2 rounded-lg bg-[#132373] text-white text-[0.84375rem] font-bold shadow-xs hover:bg-[#2d3b8a] transition-all cursor-pointer"
          >
            ဒီဇိုင်း အတည်ပြုမည်
          </button>
        </div>
      </div>

      {/* Mock Storefront Canvas */}
      <div className="bg-white rounded-2xl shadow-md border border-[#dcdfea] overflow-hidden">
        {/* Storefront Mini Header */}
        <div className="h-14 px-6 border-b border-[#dcdfea] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#132373] text-[22px]">spa</span>
            <span className="font-bold text-[#132373] font-display text-base">ရွှေနှင်းဆီ ပါတိတ်</span>
          </div>
          <div className="flex items-center gap-6 text-[0.84375rem] text-[#1a1d2e] font-medium hidden sm:flex">
            <span className="text-[#132373] font-bold border-b-2 border-[#132373] pb-0.5">ပင်မစာမျက်နှာ</span>
            <span className="hover:text-[#132373] cursor-pointer">ထဘီများ</span>
            <span className="hover:text-[#132373] cursor-pointer">အင်္ကျီ / ပဝါ</span>
            <span className="hover:text-[#132373] cursor-pointer">သဘာဝပိတ်စ</span>
            <span className="hover:text-[#132373] cursor-pointer">အလုပ်ရုံအကြောင်း</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5a5f78] text-[20px] cursor-pointer">search</span>
            <span className="material-symbols-outlined text-[#5a5f78] text-[20px] cursor-pointer">shopping_bag</span>
          </div>
        </div>

        {/* Hero Section with Artisan Story */}
        <div className="relative bg-[#132373] text-white overflow-hidden py-12 px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl z-10 space-y-3">
            <span className="text-[0.75rem] tracking-widest uppercase font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#fdbd64] border border-white/20 inline-block font-semibold">
              ARTISANAL HAND-WAX BATIK COLLECTION 2024
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display leading-tight">
              သဘာဝဖယောင်းဆွဲဆေးရိုက် ရွှေနှင်းဆီပါတိတ်လက်ရာ
            </h2>
            <p className="text-[0.875rem] text-[#dee0ff] leading-relaxed">
              မြန်မာ့ရိုးရာ မန္တလေးနှင့် အင်းလေးစတိုင် သဘာဝ မဲနယ် (Natural Indigo)၊ သစ်ခေါက်နီ (Madder Root) ဖြင့် စိတ်ရှည်လက်ရှည် ပန်းဖယောင်းရိုက်ထုတ်လုပ်ထားသော သီးသန့်အထည်များ။
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onShowToast('Storefront Interaction', 'ဖောက်သည်များသည် ကတ်တလောက်ကို ချက်ချင်း စစ်ဆေးနိုင်ပါသည်။')}
                className="px-5 py-2.5 rounded-lg bg-[#b4801f] hover:bg-[#835500] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                အထည်များ ကြည့်ရှုရန်
              </button>
              <span className="text-xs text-[#dee0ff]/80">စက်ရုံတိုက်ရိုက် အာမခံလက်ရာစစ်စစ်</span>
            </div>
          </div>

          <div className="w-full md:w-80 h-56 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 relative group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Ipza9v-CfU3gUvqqxYziPp-5-KbAQiwW4-O4sfi8TkVamQnPBZbUygolmLVrXtAmz08RKOSNq9Q4P2F_TaXUeKUfZxl9MrFVBcgocuHgi7R8KUCeURhGD7T84WGvCcpSJ1AFH-51l-NNuEOYTm-obZbXfWLExvFqzpeZymSZLl2uPFDSlsHSPnJiFa3DKTWKyAyjuBlR5U3GTL2XrPfd0YhF2lpBASz9bSEgaHbmnZxZq-IjQaNFHg"
              alt="Artisan at work"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
              <span className="text-xs font-mono text-white/90">Batch #SHS-2024-B8 Atelier</span>
            </div>
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="p-6 sm:p-10 space-y-6 bg-[#fbf8ff]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-display text-[#1a1d2e]">လူကြိုက်များသော လက်ရွေးစင် အထည်များ</h3>
              <p className="text-xs text-[#5a5f78] mt-0.5">ပစ္စည်းလက်ကျန် အခြေအနေ အလိုအလျောက် သတ်မှတ်ပြသထားပါသည်</p>
            </div>
            <span className="text-xs font-mono text-[#132373] font-bold">Auto-Stock Sync Enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => {
              const isAvailable = p.stockCount > 0;
              return (
                <div
                  key={p.sku}
                  className="bg-white rounded-xl overflow-hidden border border-[#dcdfea] shadow-xs flex flex-col group hover:shadow-md transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#132373]/90 text-white font-mono">
                        {p.sku}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          isAvailable
                            ? 'bg-[#dff0e5] text-[#2a7146]'
                            : 'bg-[#f9e1de] text-[#ad3229]'
                        }`}
                      >
                        {isAvailable ? 'ရနိုင်သည်' : 'ကုန်ပါပြီ'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#1a1d2e] truncate">{p.title}</h4>
                      <p className="text-xs text-[#5a5f78]">{p.cutDescription}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#dcdfea]">
                      <span className="font-mono font-bold text-sm text-[#132373]">
                        {p.price.toLocaleString()} Ks
                      </span>
                      <button
                        onClick={() => onShowToast('ဝယ်ယူမှု စမ်းသပ်ခြင်း', `Customer View တွင် ${p.title} ကို အဆင်သင့် စစ်ဆေးနိုင်ပါသည်။`)}
                        disabled={!isAvailable}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          isAvailable
                            ? 'bg-[#132373] text-white hover:bg-[#2d3b8a] cursor-pointer'
                            : 'bg-[#eceef5] text-[#5a5f78] cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'မှာယူမည်' : 'ကုန်ပါပြီ'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
