import React, { useState, useEffect } from 'react';
import { LOW_STOCK_ALERTS } from '../data/mockData';
import { ActivityLog } from '../types';

interface OverviewScreenProps {
  onNavigateTab: (tab: string) => void;
  onOpenOrderInspector: (orderNumber: string) => void;
  onOpenNewOrderModal: () => void;
  onShowToast: (title: string, message: string) => void;
  activityLogs: ActivityLog[];
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigateTab,
  onOpenOrderInspector,
  onOpenNewOrderModal,
  onShowToast,
  activityLogs,
}) => {
  // Live countdown timer state (24m 15s and 12m 40s)
  const [seconds1, setSeconds1] = useState(1455);
  const [seconds2, setSeconds2] = useState(760);
  const [canceledOrders, setCanceledOrders] = useState<string[]>([]);
  const [remindedOrders, setRemindedOrders] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('today');

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds1((prev) => (prev > 0 ? prev - 1 : 0));
      setSeconds2((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `ကျန် ${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRemind = (id: string, name: string) => {
    setRemindedOrders((prev) => [...prev, id]);
    onShowToast(
      'သတိပေးချက် ပေးပို့ပြီးပါပြီ',
      `${name} ထံသို့ ငွေလွှဲချိန်သတိပေး SMS / Viber မက်ဆေ့ခ်ျ ပို့ဆောင်ပြီးပါပြီ။`
    );
  };

  const handleCancelTimeoutOrder = (id: string, name: string) => {
    setCanceledOrders((prev) => [...prev, id]);
    onShowToast(
      'အော်ဒါ ပယ်ဖျက်ပြီးပါပြီ',
      `ငွေပေးချေမှု အချိန်ကျော်လွန်သဖြင့် ${name} ၏ Order ${id} ကို စနစ်မှ ပယ်ဖျက်လိုက်ပါသည်။`
    );
  };

  const handleTriggerProduction = (title: string) => {
    onShowToast(
      'အလုပ်ရုံ ထုတ်လုပ်မှု စတင်သည်',
      `"${title}" အတွက် Batch #SHS-2024-B8 တွင် ဆိုးဆေးနှင့် ဖယောင်းစိမ်ခြင်း စတင်ဆောင်ရွက်ပါပြီ။`
    );
  };

  const handleOrderBeeswax = () => {
    onShowToast(
      'ပျားဖယောင်း အဝယ်စာရင်း ဖွင့်လှစ်ပြီး',
      'မန္တလေး ရိုးရာ ပျားဖယောင်းစစ်စစ် (Grade A) 10 kg မှာယူမှု စာရင်းသွင်းပြီးပါပြီ။'
    );
  };

  return (
    <div className="px-4 sm:px-6 py-5 space-y-5 max-w-[1440px] mx-auto w-full">
      {/* Header Control Bar with Workshop Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#dcdfea]">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#2d3b8a] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">pattern</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[1.25rem] font-bold text-[#1a1d2e] tracking-tight truncate font-display">
                နေ့စဥ် ထုတ်လုပ်မှုနှင့် အရောင်းခြုံငုံ
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#dff0e5] text-[#2a7146] text-[0.72rem] font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7146] animate-pulse"></span>
                Live Sync
              </span>
            </div>
            <p className="text-[0.84375rem] text-[#5a5f78] truncate">
              ရွှေနှင်းဆီ လက်ရေးပါတိတ် အလုပ်ရုံ · မင်္ဂလာတောင်ညွန့် စက်ရုံခွဲ (Yangon)
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <div className="flex items-center bg-[#eceef5] px-3 py-1.5 rounded-lg text-[#1a1d2e] border border-[#dcdfea]">
            <span className="material-symbols-outlined text-[18px] text-[#5a5f78] mr-1.5">
              calendar_today
            </span>
            <span className="text-[0.78125rem] font-mono font-medium">
              2024 နိုဝင်ဘာ 18 ရက် · ယနေ့
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a1d2e] rounded-lg border border-[#dcdfea] shadow-xs hover:bg-[#eceef5] transition-all text-[0.84375rem] font-medium cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#5a5f78]">tune</span>
              Filter များ
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#dcdfea] p-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[0.72rem] font-bold uppercase text-[#5a5f78] px-2 py-1">ကာလ ရွေးချယ်မှု</div>
                {['today', 'yesterday', 'this_week', 'this_month'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setSelectedDateFilter(f);
                      setFilterOpen(false);
                      onShowToast('Filter အသုံးပြုပြီး', `ရွေးချယ်ထားသော ကာလအလိုက် စာရင်းများကို ချိန်ညှိပြီးပါပြီ။`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[0.78125rem] transition-colors ${
                      selectedDateFilter === f ? 'bg-[#2d3b8a] text-white font-semibold' : 'hover:bg-[#eceef5] text-[#1a1d2e]'
                    }`}
                  >
                    {f === 'today' ? 'ယနေ့ (Today)' : f === 'yesterday' ? 'မနေ့က (Yesterday)' : f === 'this_week' ? 'ယခုတစ်ပတ် (This Week)' : 'ယခုလ (This Month)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenNewOrderModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#132373] text-white rounded-lg shadow-sm hover:bg-[#2d3b8a] transition-all text-[0.84375rem] font-semibold cursor-pointer active:scale-[0.98]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Order အသစ်ထည့်
          </button>
        </div>
      </div>

      {/* 4 High Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#dcdfea] flex flex-col justify-between group hover:shadow-md hover:border-[#132373]/30 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-[#5a5f78]">
              ယနေ့ Order အရေအတွက်
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#eceef5] flex items-center justify-center text-[#132373] group-hover:bg-[#dee0ff] transition-colors">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[1.625rem] font-bold text-[#1a1d2e] font-mono">8</span>
              <span className="text-[0.84375rem] text-[#2a7146] font-semibold inline-flex items-center">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +14%
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#eceef5] text-[#1a1d2e] font-medium">
                Online 6
              </span>
              <span className="text-[#5a5f78] text-xs">·</span>
              <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#f5ead3] text-[#835500] font-medium">
                ဖုန်း 2
              </span>
            </div>
          </div>

          <div className="pt-1 text-[#5a5f78] text-[0.75rem] flex items-center justify-between border-t border-[#dcdfea]/50">
            <span>မနေ့ကထက် +1 ခု ပိုသည်</span>
            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </div>

        {/* KPI 2: Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#dcdfea] flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-[#5a5f78]">
              ယနေ့ စုစုပေါင်း ဝင်ငွေ
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#eceef5] flex items-center justify-center text-[#356447] group-hover:bg-[#dff0e5] transition-colors">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[1.625rem] font-bold text-[#1a1d2e] font-mono">245,000</span>
              <span className="text-[0.9375rem] text-[#5a5f78] font-bold">Ks</span>
            </div>
            <p className="text-[0.75rem] text-[#5a5f78] mt-1">
              Delivery fee ပါဝင်ပြီးသား (Fulfillment Ready)
            </p>
          </div>

          <div className="pt-1 text-[#5a5f78] text-[0.75rem] flex items-center justify-between border-t border-[#dcdfea]/50">
            <span>ရည်မှန်းချက်: 300,000 Ks</span>
            <span className="text-[0.78125rem] font-mono text-[#132373] font-bold">81.6%</span>
          </div>
        </div>

        {/* KPI 3: Slip Verification Alert */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#ffdad6] flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden bg-gradient-to-br from-white to-[#f9e1de]/30">
          <div className="flex items-start justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#ad3229] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">priority_high</span>
              ငွေလွှဲ စစ်ဆေးရန်
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#f9e1de] flex items-center justify-center text-[#ad3229] animate-pulse">
              <span className="material-symbols-outlined text-[18px]">receipt</span>
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.625rem] font-bold text-[#ad3229] font-mono">2</span>
              <span className="text-[0.84375rem] text-[#5a5f78]">orders</span>
            </div>
            <button
              onClick={() => onOpenOrderInspector('#1030')}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#ad3229] text-white text-[0.75rem] font-semibold hover:opacity-95 transition-opacity cursor-pointer shadow-xs active:scale-95"
              type="button"
            >
              <span>နှိပ်ပြီး screenshot စစ်ပါ</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          <div className="pt-1 text-[0.75rem] text-[#5a5f78] border-t border-[#ffdad6]/60">
            KPay / WavePay ပြေစာ အတည်ပြုရန်ကျန်
          </div>
        </div>

        {/* KPI 4: Low Stock Alert */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#faeed3] flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden bg-gradient-to-br from-white to-[#faeed3]/30">
          <div className="flex items-start justify-between">
            <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#8d5c08] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              Stock နည်း variant (≤ 2)
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#faeed3] flex items-center justify-center text-[#8d5c08]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.625rem] font-bold text-[#8d5c08] font-mono">4</span>
              <span className="text-[0.84375rem] text-[#5a5f78]">items</span>
            </div>
            <p className="text-[0.75rem] text-[#835500] font-medium mt-1">
              Published ပစ္စည်းများသာ ထည့်သွင်းထားသည်
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="pt-1 text-[0.75rem] text-[#5a5f78] hover:text-[#132373] flex items-center justify-between border-t border-[#faeed3]/60 cursor-pointer text-left"
          >
            <span>ဖယောင်းဆိုးဆေး ပုံစံများ</span>
            <span className="material-symbols-outlined text-[14px]">tune</span>
          </button>
        </div>
      </div>

      {/* Sales Channel Breakdown Component */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#dcdfea] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2c3f8f] text-[20px]">hub</span>
            <h2 className="text-[0.9375rem] font-bold text-[#1a1d2e]">
              အရောင်းလမ်းကြောင်း ခွဲခြမ်းစိတ်ဖြာမှု (Sales Channel Breakdown)
            </h2>
          </div>
          <span className="text-[0.78125rem] font-mono text-[#5a5f78]">
            Total: 8 Orders · 245,000 Ks
          </span>
        </div>

        {/* Visual Metric Bar */}
        <div className="w-full h-3 rounded-full bg-[#eceef5] overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-[#2c3f8f] transition-all duration-500 rounded-l-full"
            style={{ width: '75%' }}
            title="Online Store: 75%"
          />
          <div
            className="h-full bg-[#835500] transition-all duration-500 rounded-r-full"
            style={{ width: '25%' }}
            title="Phone/Viber/Messenger: 25%"
          />
        </div>

        {/* Metrics Legend Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#eceef5] border border-[#dcdfea]/60">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#2c3f8f] shrink-0" />
              <div>
                <span className="text-[0.84375rem] font-semibold text-[#1a1d2e] block">
                  Online Store Web Checkout
                </span>
                <span className="text-[0.75rem] text-[#5a5f78]">Shopper self-service direct orders</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[0.9375rem] font-bold text-[#1a1d2e] font-mono">75%</span>
              <span className="block text-[0.75rem] font-mono text-[#5a5f78]">6 orders (183,750 Ks)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#eceef5] border border-[#dcdfea]/60">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#835500] shrink-0" />
              <div>
                <span className="text-[0.84375rem] font-semibold text-[#1a1d2e] block">
                  Phone / Viber / Messenger
                </span>
                <span className="text-[0.75rem] text-[#5a5f78]">Manual assisted staff entry</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[0.9375rem] font-bold text-[#1a1d2e] font-mono">25%</span>
              <span className="block text-[0.75rem] font-mono text-[#5a5f78]">2 orders (61,250 Ks)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Action Queues (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Pending Action List (လုပ်ရန်ကျန်) */}
          <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#dcdfea]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7d2f2a]" />
                <h2 className="text-[0.9375rem] font-bold text-[#1a1d2e]">
                  လုပ်ရန်ကျန်ရှိသော လုပ်ငန်းစဥ်များ (Pending Actions)
                </h2>
              </div>
              <span className="text-[0.72rem] px-2.5 py-0.5 rounded-full bg-[#f9e1de] text-[#ad3229] font-bold">
                {4 - canceledOrders.length} Orders ကျန်
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Slip Review Item 1 */}
              <div className="p-3.5 rounded-lg bg-[#eceef5] hover:bg-[#e4e7ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#dcdfea]/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f9e1de] text-[#ad3229] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[0.78125rem] font-bold text-[#132373]">#1030</span>
                      <span className="text-[0.84375rem] font-semibold text-[#1a1d2e]">
                        ဒေါ်ခင်ခင် (Yangon)
                      </span>
                      <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#f9e1de] text-[#ad3229] font-bold">
                        Slip စစ်ရန်
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-[#5a5f78] mt-0.5">
                      KBZPay Mobile App · 45,000 Ks · ပန်းပွင့်ဖယောင်းစင်း ပါတိတ် (၂ ကိုက်)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onOpenOrderInspector('#1030')}
                    className="px-3.5 py-1 rounded-lg bg-[#132373] text-white text-[0.84375rem] font-semibold hover:bg-[#2d3b8a] transition-colors cursor-pointer shadow-xs active:scale-95"
                    type="button"
                  >
                    စစ်မည်
                  </button>
                </div>
              </div>

              {/* Slip Review Item 2 */}
              <div className="p-3.5 rounded-lg bg-[#eceef5] hover:bg-[#e4e7ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#dcdfea]/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f9e1de] text-[#ad3229] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[0.78125rem] font-bold text-[#132373]">#1028</span>
                      <span className="text-[0.84375rem] font-semibold text-[#1a1d2e]">
                        မအေးသီ (Mandalay)
                      </span>
                      <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#f9e1de] text-[#ad3229] font-bold">
                        Slip စစ်ရန်
                      </span>
                    </div>
                    <p className="text-[0.75rem] text-[#5a5f78] mt-0.5">
                      WavePay QR · 38,000 Ks · ကနုတ်ပန်းနွယ် အပြာရင့်
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onOpenOrderInspector('#1028')}
                    className="px-3.5 py-1 rounded-lg bg-[#132373] text-white text-[0.84375rem] font-semibold hover:bg-[#2d3b8a] transition-colors cursor-pointer shadow-xs active:scale-95"
                    type="button"
                  >
                    စစ်မည်
                  </button>
                </div>
              </div>

              {/* Payment Timeout Pending 1: #1032 */}
              {!canceledOrders.includes('#1032') && (
                <div className="p-3.5 rounded-lg bg-[#eceef5] hover:bg-[#e4e7ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#dcdfea]/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#faeed3] text-[#8d5c08] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">timer</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[0.78125rem] font-bold text-[#132373]">#1032</span>
                        <span className="text-[0.84375rem] font-semibold text-[#1a1d2e]">ကိုအောင်သူ</span>
                        <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#faeed3] text-[#8d5c08] font-bold flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
                          {formatCountdown(seconds1)}
                        </span>
                      </div>
                      <p className="text-[0.75rem] text-[#5a5f78] mt-0.5">
                        Viber Order · ငွေလွှဲစောင့်ဆိုင်းချိန် သတ်မှတ်ထားသည်
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleRemind('#1032', 'ကိုအောင်သူ')}
                      disabled={remindedOrders.includes('#1032')}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#5a5f78] hover:text-[#1a1d2e] text-[0.75rem] font-medium border border-[#dcdfea] transition-colors cursor-pointer disabled:opacity-50"
                      type="button"
                    >
                      {remindedOrders.includes('#1032') ? 'သတိပေးပြီး' : 'သတိပေးရန်'}
                    </button>
                    <button
                      onClick={() => handleCancelTimeoutOrder('#1032', 'ကိုအောင်သူ')}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#ad3229] hover:bg-[#f9e1de] text-[0.75rem] font-medium border border-[#ffdad6] transition-colors cursor-pointer"
                      type="button"
                    >
                      ပယ်ဖျက်
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Timeout Pending 2: #1031 */}
              {!canceledOrders.includes('#1031') && (
                <div className="p-3.5 rounded-lg bg-[#eceef5] hover:bg-[#e4e7ff] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#dcdfea]/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#faeed3] text-[#8d5c08] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">timer</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[0.78125rem] font-bold text-[#132373]">#1031</span>
                        <span className="text-[0.84375rem] font-semibold text-[#1a1d2e]">ဒေါ်နီနီဝင်း</span>
                        <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#faeed3] text-[#8d5c08] font-bold flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
                          {formatCountdown(seconds2)}
                        </span>
                      </div>
                      <p className="text-[0.75rem] text-[#5a5f78] mt-0.5">
                        Messenger Order · 52,000 Ks · ပုသိမ်ထီးဖယောင်းပွင့်
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleRemind('#1031', 'ဒေါ်နီနီဝင်း')}
                      disabled={remindedOrders.includes('#1031')}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#5a5f78] hover:text-[#1a1d2e] text-[0.75rem] font-medium border border-[#dcdfea] transition-colors cursor-pointer disabled:opacity-50"
                      type="button"
                    >
                      {remindedOrders.includes('#1031') ? 'သတိပေးပြီး' : 'သတိပေးရန်'}
                    </button>
                    <button
                      onClick={() => handleCancelTimeoutOrder('#1031', 'ဒေါ်နီနီဝင်း')}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#ad3229] hover:bg-[#f9e1de] text-[0.75rem] font-medium border border-[#ffdad6] transition-colors cursor-pointer"
                      type="button"
                    >
                      ပယ်ဖျက်
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders (နောက်ဆုံး Order များ) */}
          <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcdfea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2c3f8f] text-[20px]">
                  receipt_long
                </span>
                <h2 className="text-[0.9375rem] font-bold text-[#1a1d2e]">
                  နောက်ဆုံး Order များ (Recent Orders)
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-[0.75rem] font-semibold text-[#132373] hover:underline flex items-center gap-1 cursor-pointer"
              >
                အားလုံးကြည့်ရန် <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eceef5] text-[0.72rem] text-[#5a5f78] uppercase font-semibold">
                    <th className="py-2.5 px-3 rounded-l-md font-mono">Order ID</th>
                    <th className="py-2.5 px-3">ဝယ်ယူသူ</th>
                    <th className="py-2.5 px-3">အချိန်</th>
                    <th className="py-2.5 px-3 text-right">ကျသင့်ငွေ</th>
                    <th className="py-2.5 px-3 rounded-r-md text-center">အခြေအနေ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dcdfea] text-[0.84375rem]">
                  <tr
                    onClick={() => onOpenOrderInspector('#1033')}
                    className="hover:bg-[#eceef5]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#132373]">#1033</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1a1d2e] block">မစန္ဒာ</span>
                      <span className="text-[0.72rem] text-[#5a5f78]">Online Order · 1 item</span>
                    </td>
                    <td className="py-3 px-3 text-[0.75rem] text-[#5a5f78]">လွန်ခဲ့သော 8 မိနစ်</td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-[#1a1d2e]">32,000 Ks</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#f5ead3] text-[#8d5c08]">
                        Review
                      </span>
                    </td>
                  </tr>

                  <tr
                    onClick={() => onOpenOrderInspector('#1029')}
                    className="hover:bg-[#eceef5]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#132373]">#1029</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1a1d2e] block">ဦးမင်းသူ</span>
                      <span className="text-[0.72rem] text-[#5a5f78]">Phone Order · 2 items</span>
                    </td>
                    <td className="py-3 px-3 text-[0.75rem] text-[#5a5f78]">လွန်ခဲ့သော 1 နာရီ</td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-[#1a1d2e]">64,000 Ks</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#dff0e5] text-[#2a7146]">
                        Paid
                      </span>
                    </td>
                  </tr>

                  <tr
                    onClick={() => onOpenOrderInspector('#1027')}
                    className="hover:bg-[#eceef5]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#132373]">#1027</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1a1d2e] block">ဒေါ်ဇင်မာ</span>
                      <span className="text-[0.72rem] text-[#5a5f78]">Online Order · 1 item</span>
                    </td>
                    <td className="py-3 px-3 text-[0.75rem] text-[#5a5f78]">လွန်ခဲ့သော 2 နာရီ</td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-[#1a1d2e]">28,500 Ks</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#dee0ff] text-[#132373]">
                        Delivered
                      </span>
                    </td>
                  </tr>

                  <tr
                    onClick={() => onOpenOrderInspector('#1026')}
                    className="hover:bg-[#eceef5]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#132373]">#1026</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1a1d2e] block">ကိုကျော်စွာ</span>
                      <span className="text-[0.72rem] text-[#5a5f78]">Viber Order · 3 items</span>
                    </td>
                    <td className="py-3 px-3 text-[0.75rem] text-[#5a5f78]">လွန်ခဲ့သော 3 နာရီ</td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-[#1a1d2e]">88,500 Ks</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-bold bg-[#faeed3] text-[#8d5c08]">
                        Awaiting
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Low Stock Variants & Activity Log (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Low Stock Alert List (Stock နည်းနေသော ပစ္စည်း) */}
          <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcdfea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d5c08] text-[20px]">
                  production_quantity_limits
                </span>
                <h2 className="text-[0.9375rem] font-bold text-[#1a1d2e]">
                  Stock နည်းနေသော ပစ္စည်းများ
                </h2>
              </div>
              <span className="text-[0.72rem] px-2.5 py-0.5 rounded-full bg-[#faeed3] text-[#8d5c08] font-bold">
                ≤ 2 ကျန်
              </span>
            </div>

            <div className="space-y-3">
              {LOW_STOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#eceef5] transition-colors border border-transparent hover:border-[#dcdfea]"
                >
                  {alert.isRawBeeswax ? (
                    <div className="w-14 h-14 rounded-lg bg-[#eceef5] flex items-center justify-center text-[#835500] shrink-0 shadow-xs border border-[#dcdfea]">
                      <span className="material-symbols-outlined text-[24px]">dry_cleaning</span>
                    </div>
                  ) : (
                    <img
                      src={alert.img}
                      alt={alert.title}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-xs border border-[#dcdfea]"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-[0.84375rem] font-bold text-[#1a1d2e] truncate block">
                      {alert.title}
                    </span>
                    <span className="text-[0.75rem] text-[#5a5f78] block">{alert.colorSize}</span>
                    <span className={`text-[0.72rem] font-mono font-medium block mt-0.5 ${alert.colorHex}`}>
                      {alert.sku}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-bold ${alert.badgeStyle}`}>
                      {alert.remaining}
                    </span>
                    <button
                      onClick={() =>
                        alert.isRawBeeswax ? handleOrderBeeswax() : handleTriggerProduction(alert.title)
                      }
                      className="block text-[0.75rem] text-[#132373] font-semibold hover:underline mt-1 text-right w-full cursor-pointer"
                      type="button"
                    >
                      {alert.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-[#dcdfea]">
              <button
                onClick={() => onNavigateTab('products')}
                className="text-[0.84375rem] text-[#132373] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                Stock အားလုံး စစ်ဆေးရန် (Inventory Portal)
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Activity Log (လှုပ်ရှားမှု မှတ်တမ်း) */}
          <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcdfea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2c3f8f] text-[20px]">history</span>
                <h2 className="text-[0.9375rem] font-bold text-[#1a1d2e]">
                  လှုပ်ရှားမှု မှတ်တမ်း (Activity Log)
                </h2>
              </div>
              <span className="text-[0.72rem] font-mono text-[#5a5f78]">Live Feed</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dcdfea]">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative">
                  <span className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ${log.dotColor}`} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.84375rem] font-bold text-[#1a1d2e]">
                        {log.role} ({log.name})
                      </span>
                      <span className="text-[0.72rem] font-mono text-[#5a5f78]">{log.time}</span>
                    </div>
                    <p className="text-[0.75rem] text-[#5a5f78] mt-0.5 leading-relaxed">
                      {log.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
