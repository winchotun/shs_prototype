import React from 'react';
import { INITIAL_STAFF } from '../data/mockData';
import { Staff } from '../types';

interface StaffScreenProps {
  onShowToast: (title: string, message: string) => void;
}

export const StaffScreen: React.FC<StaffScreenProps> = ({ onShowToast }) => {
  const staffList: Staff[] = INITIAL_STAFF;

  return (
    <div className="px-4 sm:px-6 py-5 space-y-6 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#132373]"></span>
            <span className="text-[0.72rem] font-bold uppercase text-[#5a5f78] tracking-wider">
              Artisan Guild & Staff Directory
            </span>
          </div>
          <h1 className="text-[1.375rem] font-bold text-[#1a1d2e] font-display">
            ရွှေနှင်းဆီ အလုပ်ရုံ ဝန်ထမ်းနှင့် လက်မှုပညာရှင်များ
          </h1>
          <p className="text-[0.84375rem] text-[#5a5f78] mt-0.5">
            သဘာဝဆေးဆိုးပညာရှင် (Dye Masters)၊ အရောင်းစာရင်းနှင့် အလုပ်ရုံကြီးကြပ်သူများ၏ လုပ်ငန်းတာဝန်များ
          </p>
        </div>

        <button
          onClick={() => onShowToast('ဝန်ထမ်းအသစ်', 'ဝန်ထမ်းအသစ် သတ်မှတ်ရန် ဖောင်ဖွင့်လှစ်နေပါသည်။')}
          className="px-4 py-2 rounded-lg bg-[#132373] text-white text-[0.84375rem] font-bold shadow-xs hover:bg-[#2d3b8a] transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          + ဝန်ထမ်းအသစ်ထည့်
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-xl border border-[#dcdfea] shadow-xs p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${st.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-xs`}
                  >
                    {st.name.slice(0, 2)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base text-[#1a1d2e] truncate">{st.name}</span>
                    <span className="text-xs text-[#132373] font-semibold">{st.role}</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dff0e5] text-[#2a7146] text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2a7146]"></span> Active
                </span>
              </div>

              <div className="bg-[#eceef5] p-3 rounded-lg space-y-1.5 text-xs text-[#5a5f78]">
                <div className="flex items-center justify-between">
                  <span>ဖုန်း:</span>
                  <span className="font-mono text-[#1a1d2e] font-semibold">{st.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>အီးမေးလ်:</span>
                  <span className="font-mono text-[#1a1d2e]">{st.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>အဆိုင်း (Shift):</span>
                  <span className="text-[#1a1d2e] font-medium">{st.shift}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#dcdfea] flex items-center justify-between text-xs">
              <span className="font-mono text-[#5a5f78]">Role: {st.roleKey}</span>
              <button
                onClick={() => onShowToast('အခွင့်အာဏာ ပြင်ဆင်ခြင်း', `${st.name} ၏ Permissions & Role ကို ပြင်ဆင်ရန် အတည်ပြုပြီးပါပြီ။`)}
                className="text-[#132373] font-bold hover:underline cursor-pointer"
              >
                ပြင်ဆင်ရန်
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
