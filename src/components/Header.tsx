import React, { useState } from 'react';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onOpenMobileSidebar: () => void;
  onNavigateToTab?: (tab: string) => void;
  pendingReviewsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenMobileSidebar,
  onNavigateToTab,
  pendingReviewsCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'စလစ် အတည်ပြုရန်ကျန်ရှိ',
      desc: 'Order #1030 ဒေါ်မြင့်မြင့်ဦး မှ WavePay 145,000 Ks စလစ်တင်ထားသည်',
      time: '၂၆ မိနစ်က',
      tab: 'orders',
      type: 'critical',
    },
    {
      id: 2,
      title: 'ငွေစောင့်ဆိုင်းချိန် သတိပေးချက်',
      desc: 'Order #1032 ကိုအောင်သူ ငွေလွှဲစောင့်ဆိုင်းချိန် ၂၄ မိနစ်သာ ကျန်ပါတော့သည်',
      time: '၄ မိနစ်က',
      tab: 'orders',
      type: 'warning',
    },
    {
      id: 3,
      title: 'သဘာဝမဲနယ်ပိတ်စ လက်ကျန်ကုန်',
      desc: 'သဘာဝ မဲနယ် Indigo ပိတ်စ (P003) ပစ္စည်းကုန်ပြီး Restocking အဆင့်သို့ ပြောင်းလဲခဲ့သည်',
      time: '၁ နာရီက',
      tab: 'products',
      type: 'info',
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-[232px] right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#dcdfea] z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Prototype status badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-[#5a5f78] hover:bg-[#eceef5] hover:text-[#132373] transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5ead3] border border-[#dcdfea]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#835500]"></span>
          <span className="text-[0.75rem] text-[#835500] font-semibold">
            Prototype · နမူနာ data
          </span>
        </div>

        <div className="h-4 w-px bg-[#dcdfea] hidden sm:block"></div>
        <span className="text-[0.75rem] text-[#5a5f78] hidden md:inline truncate font-medium">
          Artisanal Hand-Wax Batik Control Center
        </span>
      </div>

      {/* Right: Role Switcher, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher */}
        <div className="relative flex items-center">
          <label className="sr-only" htmlFor="role-switcher">User Role Switcher</label>
          <div className="flex items-center bg-[#eceef5] border border-[#dcdfea] rounded-lg pl-2 sm:pl-2.5 pr-1.5 py-1 gap-1.5">
            <span className="material-symbols-outlined text-[#5a5f78] text-[18px]">
              shield_person
            </span>
            <select
              id="role-switcher"
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent text-[0.78125rem] font-medium text-[#1a1d2e] border-none focus:outline-none cursor-pointer pr-1"
            >
              <option value="owner">Owner (ပိုင်ရှင်)</option>
              <option value="manager">Manager (မန်နေဂျာ)</option>
              <option value="order-staff">Order Staff (အရောင်းစာရင်း)</option>
              <option value="content-staff">Content Staff (စာမျက်နှာစီမံ)</option>
            </select>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="w-9 h-9 rounded-lg border border-[#dcdfea] bg-white hover:bg-[#eceef5] flex items-center justify-center text-[#5a5f78] transition-colors relative cursor-pointer"
            type="button"
            title="အသိပေးချက်များ"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {pendingReviewsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7d2f2a]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#dcdfea] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-[#dcdfea] flex items-center justify-between">
                <span className="text-[0.84375rem] font-bold text-[#1a1d2e]">အသိပေးချက်များ</span>
                <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-[#faeed3] text-[#8d5c08] font-semibold">
                  {notifications.length} ခု
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#eceef5]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab(n.tab);
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-[#eceef5] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[0.78125rem] font-bold text-[#132373] flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            n.type === 'critical' ? 'bg-[#ad3229]' : n.type === 'warning' ? 'bg-[#8d5c08]' : 'bg-[#2c3f8f]'
                          }`}
                        />
                        {n.title}
                      </span>
                      <span className="text-[0.7rem] text-[#5a5f78]">{n.time}</span>
                    </div>
                    <p className="text-[0.75rem] text-[#5a5f78] mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-[#dcdfea] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[0.75rem] text-[#132373] font-semibold hover:underline"
                >
                  အားလုံးဖတ်ပြီးအဖြစ် သတ်မှတ်ရန်
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-[#132373] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            type="button"
            title="အကောင့် အချက်အလက်"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#dcdfea] p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#dcdfea]">
                <div className="w-9 h-9 rounded-full bg-[#132373] text-white flex items-center justify-center font-bold text-sm">
                  SH
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.84375rem] font-bold text-[#1a1d2e] truncate">
                    ရွှေနှင်းဆီ စီမံခန့်ခွဲသူ
                  </span>
                  <span className="text-[0.7rem] text-[#5a5f78] truncate">
                    {currentRole === 'owner'
                      ? 'Owner (ပိုင်ရှင်)'
                      : currentRole === 'manager'
                      ? 'Manager (မန်နေဂျာ)'
                      : currentRole === 'order-staff'
                      ? 'Order Staff (အရောင်းစာရင်း)'
                      : 'Content Staff (စာမျက်နှာစီမံ)'}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <div className="text-[0.75rem] text-[#5a5f78] flex items-center justify-between py-1">
                  <span>စက်ရုံခွဲ:</span>
                  <span className="font-semibold text-[#1a1d2e]">မင်္ဂလာတောင်ညွန့် (Yangon)</span>
                </div>
                <div className="text-[0.75rem] text-[#5a5f78] flex items-center justify-between py-1">
                  <span>Batch:</span>
                  <span className="font-mono text-[#2c3f8f] font-semibold">#SHS-2024-B8</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#dcdfea]">
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full py-1 text-center text-[0.75rem] text-[#5a5f78] hover:text-[#132373] hover:bg-[#eceef5] rounded-md transition-colors"
                >
                  ပိတ်မည်
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
