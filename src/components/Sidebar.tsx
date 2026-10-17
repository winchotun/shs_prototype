import React from 'react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  reviewCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  reviewCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview', label: 'ခြုံငုံ (Overview)', icon: 'dashboard', badge: null },
    { id: 'orders', label: 'Order များ', icon: 'receipt_long', badge: reviewCount > 0 ? reviewCount : null },
    { id: 'products', label: 'ပစ္စည်းများ (Products)', icon: 'styler', badge: null },
    { id: 'customers', label: 'Customer များ', icon: 'groups', badge: null },
    { id: 'homepage', label: 'Homepage ဒီဇိုင်း', icon: 'storefront', badge: null },
  ];

  const generalItems = [
    { id: 'staff', label: 'ဝန်ထမ်း (Staff)', icon: 'badge' },
    { id: 'settings', label: 'ဆက်တင် (Settings)', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#121528]/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[232px] bg-white z-50 flex flex-col border-r border-[#dcdfea] transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#dcdfea] bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#132373] flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">spa</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[0.9375rem] text-[#132373] tracking-tight truncate font-display">
                ရွှေနှင်းဆီ ပါတိတ်
              </span>
              <span className="text-[0.7rem] text-[#5a5f78] uppercase tracking-wider truncate font-mono">
                Shwe Hnin Si Atelier
              </span>
            </div>
          </div>

          <button
            className="lg:hidden text-[#5a5f78] hover:text-[#132373] p-1"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Section 1: Management System */}
        <div className="px-3 pt-3 pb-1">
          <span className="text-[0.7rem] uppercase text-[#5a5f78] tracking-wider font-semibold px-2">
            စီမံခန့်ခွဲမှုစနစ်
          </span>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#2d3b8a] text-white font-medium shadow-xs'
                    : 'text-[#1a1d2e] hover:bg-[#eceef5] hover:text-[#132373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      isActive ? 'text-white' : 'text-[#5a5f78] group-hover:text-[#132373]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[0.84375rem]">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`font-semibold text-[0.72rem] px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#faeed3] text-[#8d5c08]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Section 2: General */}
          <div className="pt-3 pb-1">
            <span className="text-[0.7rem] uppercase text-[#5a5f78] tracking-wider font-semibold px-2">
              အထွေထွေ
            </span>
          </div>

          {generalItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#2d3b8a] text-white font-medium shadow-xs'
                    : 'text-[#1a1d2e] hover:bg-[#eceef5] hover:text-[#132373]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      isActive ? 'text-white' : 'text-[#5a5f78] group-hover:text-[#132373]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[0.84375rem]">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Batch Tag */}
        <div className="p-3 border-t border-[#dcdfea] bg-[#eceef5]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[0.7rem] text-[#5a5f78] font-semibold">Dye Studio Batch</span>
              <span className="text-[0.78125rem] text-[#2c3f8f] font-mono font-semibold">#SHS-2024-B8</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#2a7146] animate-pulse" title="Live System Active" />
          </div>
        </div>
      </aside>
    </>
  );
};
