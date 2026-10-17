import React, { useState } from 'react';

interface SettingsScreenProps {
  onShowToast: (title: string, message: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast }) => {
  const [timeoutMinutes, setTimeoutMinutes] = useState(30);
  const [kpayPhone, setKpayPhone] = useState('09 7712 34561');
  const [kpayName, setKpayName] = useState('ဒေါ်အေးအေးမာ (Shwe Hnin Si Atelier)');
  const [wavePhone, setWavePhone] = useState('09 7712 34561');
  const [waveName, setWaveName] = useState('ရွှေနှင်းဆီ ပါတိတ်');
  const [batchCode, setBatchCode] = useState('#SHS-2024-B8');

  const handleSave = () => {
    onShowToast('ဆက်တင်များ သိမ်းဆည်းပြီး', 'အလုပ်ရုံ စီမံခန့်ခွဲမှု ဆက်တင်များနှင့် ငွေလက်ခံအကောင့်များကို အောင်မြင်စွာ သိမ်းဆည်းလိုက်ပါသည်။');
  };

  return (
    <div className="px-4 sm:px-6 py-5 space-y-6 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#132373]"></span>
            <span className="text-[0.72rem] font-bold uppercase text-[#5a5f78] tracking-wider">
              System Configuration
            </span>
          </div>
          <h1 className="text-[1.375rem] font-bold text-[#1a1d2e] font-display">
            အလုပ်ရုံနှင့် အရောင်းစနစ် ဆက်တင်များ
          </h1>
          <p className="text-[0.84375rem] text-[#5a5f78] mt-0.5">
            ငွေလက်ခံ QR စနစ်၊ Auto-Expiry သတ်မှတ်ချိန်၊ Delivery Partner များနှင့် စက်ရုံခွဲ ဆက်တင်များ
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-[#132373] text-white text-[0.84375rem] font-bold shadow-xs hover:bg-[#2d3b8a] transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          ဆက်တင်များ သိမ်းဆည်းမည်
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Configuration */}
        <div className="bg-white rounded-xl border border-[#dcdfea] shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#dcdfea]">
            <span className="material-symbols-outlined text-[#132373] text-[20px]">account_balance_wallet</span>
            <h3 className="font-bold text-base text-[#1a1d2e]">ငွေပေးချေမှု & QR စနစ်များ (Payment Gateway)</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* KBZPay */}
            <div className="p-3.5 rounded-lg bg-[#eceef5] space-y-2 border border-[#dcdfea]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#2c3f8f] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2c3f8f]"></span> KBZPay / KPay QR
                </span>
                <span className="text-[10px] bg-[#dff0e5] text-[#2a7146] font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[#5a5f78] font-semibold block mb-1">ဖုန်းနံပါတ်</label>
                  <input
                    type="text"
                    value={kpayPhone}
                    onChange={(e) => setKpayPhone(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white rounded border border-[#dcdfea] font-mono text-xs text-[#1a1d2e]"
                  />
                </div>
                <div>
                  <label className="text-[#5a5f78] font-semibold block mb-1">အကောင့်အမည်</label>
                  <input
                    type="text"
                    value={kpayName}
                    onChange={(e) => setKpayName(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white rounded border border-[#dcdfea] text-xs text-[#1a1d2e]"
                  />
                </div>
              </div>
            </div>

            {/* WavePay */}
            <div className="p-3.5 rounded-lg bg-[#eceef5] space-y-2 border border-[#dcdfea]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#8d5c08] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8d5c08]"></span> WavePay QR & Transfer
                </span>
                <span className="text-[10px] bg-[#dff0e5] text-[#2a7146] font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[#5a5f78] font-semibold block mb-1">ဖုန်းနံပါတ်</label>
                  <input
                    type="text"
                    value={wavePhone}
                    onChange={(e) => setWavePhone(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white rounded border border-[#dcdfea] font-mono text-xs text-[#1a1d2e]"
                  />
                </div>
                <div>
                  <label className="text-[#5a5f78] font-semibold block mb-1">အကောင့်အမည်</label>
                  <input
                    type="text"
                    value={waveName}
                    onChange={(e) => setWaveName(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white rounded border border-[#dcdfea] text-xs text-[#1a1d2e]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automation & Production Settings */}
        <div className="bg-white rounded-xl border border-[#dcdfea] shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#dcdfea]">
            <span className="material-symbols-outlined text-[#132373] text-[20px]">tune</span>
            <h3 className="font-bold text-base text-[#1a1d2e]">အော်ဒါ အလိုအလျောက် သတ်မှတ်ချက်များ</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Payment Timeout */}
            <div className="p-3.5 rounded-lg bg-[#faeed3]/40 border border-[#faeed3] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#8d5c08] flex items-center gap-1.5 text-sm">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  Online Order ငွေလွှဲစောင့်ဆိုင်းချိန် (Payment Timeout)
                </span>
                <span className="font-mono font-bold text-sm text-[#8d5c08]">{timeoutMinutes} မိနစ်</span>
              </div>
              <p className="text-[#5a5f78] leading-relaxed">
                Online Store တွင် shopper self-checkout ပြုလုပ်ပြီး ဤသတ်မှတ်ချိန်အတွင်း စလစ်မတင်ပါက အော်ဒါကို စနစ်မှ အလိုအလျောက် ပယ်ဖျက်ပြီး ပစ္စည်းလက်ကျန် (Stock) ပြန်လည်ဖြည့်သွင်းပါမည်။
              </p>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-[#8d5c08] cursor-pointer"
                />
              </div>
            </div>

            {/* Current Production Batch */}
            <div className="p-3.5 rounded-lg bg-[#eceef5] border border-[#dcdfea] space-y-2">
              <label className="font-bold text-sm text-[#1a1d2e] block">
                လက်ရှိ လုပ်ဆောင်နေသော Atelier Batch Code
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full h-9 px-3 bg-white rounded-lg border border-[#dcdfea] font-mono font-bold text-sm text-[#132373]"
              />
              <span className="text-[#5a5f78] block text-[11px]">
                ထုတ်လုပ်မှုလိုင်းအားလုံးနှင့် လက်ကျန်စာရင်းတွင် ဤ Batch ကုဒ်ကို ချိတ်ဆက်အသုံးပြုပါမည်။
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
