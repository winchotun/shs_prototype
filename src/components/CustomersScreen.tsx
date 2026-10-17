import React, { useState, useMemo } from 'react';
import { Customer, Order } from '../types';

interface CustomersScreenProps {
  customers: Customer[];
  onAddOrder: (newOrder: Order) => void;
  onUpdateCustomerNotes: (customerId: string, notes: string) => void;
  onShowToast: (title: string, message: string) => void;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  onAddOrder,
  onUpdateCustomerNotes,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
  const [drawerTab, setDrawerTab] = useState<'details' | 'order'>('details');

  // Customer notes state & auto-save
  const [customerNotes, setCustomerNotes] = useState(customers[0]?.notes || '');
  const [noteSaveStatus, setNoteSaveStatus] = useState('သိမ်းဆည်းထားပြီး');

  // Phone order form state
  const [selectedProductPrice, setSelectedProductPrice] = useState<number>(120000);
  const [selectedProductTitle, setSelectedProductTitle] = useState('ရွှေနှင်းဆီ ပိုးပါတိတ် (သဘာဝအင်ဒီဂိုပြာ)');
  const [orderQty, setOrderQty] = useState<number>(2);
  const [deliveryMethod, setDeliveryMethod] = useState('Royal Express (အိမ်အရောက်)');
  const [deliveryAddress, setDeliveryAddress] = useState(customers[0]?.address || '');

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (cityFilter !== 'all' && !cust.city.includes(cityFilter)) return false;
      if (tagFilter !== 'all') {
        if (tagFilter === 'VIP' && cust.tag !== 'VIP') return false;
        if (tagFilter === 'Wholesale' && cust.tag !== 'Wholesale') return false;
        if (tagFilter === 'Regular' && cust.tag !== 'Regular') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cust.name.toLowerCase().includes(q);
        const matchesPhone = cust.phone.toLowerCase().includes(q);
        const matchesCity = cust.city.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesCity) return false;
      }
      return true;
    });
  }, [customers, cityFilter, tagFilter, searchQuery]);

  const openDrawer = (customer: Customer, startInOrderTab = false) => {
    setSelectedCustomer(customer);
    setCustomerNotes(customer.notes);
    setDeliveryAddress(customer.address);
    setDrawerTab(startInOrderTab ? 'order' : 'details');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle note change with debounce
  const handleNoteChange = (text: string) => {
    setCustomerNotes(text);
    setNoteSaveStatus('သိမ်းဆည်းနေသည်...');
    const timer = setTimeout(() => {
      onUpdateCustomerNotes(selectedCustomer.id, text);
      setNoteSaveStatus('သိမ်းဆည်းထားပြီး');
    }, 600);
    return () => clearTimeout(timer);
  };

  // Dynamic calculations for phone order
  const orderSubtotal = selectedProductPrice * orderQty;
  const isVip = selectedCustomer.tag === 'VIP';
  const orderDiscount = isVip ? Math.round(orderSubtotal * 0.1) : 0;
  const deliveryFee = 3500;
  const orderGrandTotal = orderSubtotal - orderDiscount + deliveryFee;

  const handleConfirmPhoneOrder = () => {
    const newOrdNum = `#${Math.floor(1034 + Math.random() * 50)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrdNum,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: deliveryAddress,
      channel: 'phone',
      channelLabel: 'ဖုန်း Order',
      items: [
        {
          title: selectedProductTitle,
          sku: 'SHS-ORD-NEW',
          qty: orderQty,
          price: selectedProductPrice,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5MNKceBcsEkhYYTiywZGKSh7SyNuaRnfnQZtY3kaq0iZCHGV5WcAurMlSRS35ld2R1TXYo_BCLYnYoHl43qK468WJoOtPHFVydYxfyHUmjcF9V1G2QTasIi5OEnH0zqTl8wwRGx2_ShTJzk4o0XQcVFzoh-badKjkYlPQCr8OUjw1aUNjfZKWuy_vPB78Sw0lqhPuV-NVNhcfK9GPKoF1MNgfr78zPc7KWEBTxX76CEsCgPlmm4MX5A',
        },
      ],
      subtotal: orderSubtotal,
      deliveryFee: deliveryFee,
      discount: orderDiscount,
      totalAmount: orderGrandTotal,
      paymentMethod: 'kpay_slip',
      paymentMethodLabel: 'ဖုန်း/ငွေလွှဲ',
      status: 'review',
      statusLabel: 'စစ်ဆေးရန်',
      timeAgo: 'အခုလေးတင်',
      createdAt: 'ယနေ့ 11:55 AM',
      internalNote: `ဖုန်းဖြင့် တိုက်ရိုက်မှာယူထားသည်။ ပို့ဆောင်မည့်ဂိတ်/နည်းလမ်း: ${deliveryMethod}`,
    };

    onAddOrder(newOrder);
    closeDrawer();
    onShowToast(
      'ဖုန်းအော်ဒါ အောင်မြင်ပါသည်',
      `${selectedCustomer.name} အတွက် Order ${newOrdNum} (ကျသင့်ငွေ ${orderGrandTotal.toLocaleString()} Ks) အသစ်ဖွင့်လှစ်ပြီးပါပြီ။`
    );
  };

  const handleExportClientCSV = () => {
    const headers = ['Name', 'Phone', 'City', 'District', 'Address', 'Tag', 'Orders Count', 'Total Spent (Ks)', 'Batik Notes'];
    const rows = filteredCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      `"${c.district}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      c.tagLabel,
      c.orderCount,
      c.totalSpent,
      `"${c.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shwe_hnin_si_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Client Directory ထုတ်ယူပြီး', `ဖောက်သည် ${filteredCustomers.length} ဦး၏ အချက်အလက်များကို CSV အဖြစ် ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ။`);
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Top Ambient Banner & Metric Strip */}
      <section className="px-4 sm:px-6 pt-5">
        <div className="relative bg-white rounded-xl shadow-xs border border-[#dcdfea] p-5 sm:p-6 overflow-hidden">
          {/* Decorative Batik Loom Background Watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-[0.06] pointer-events-none select-none text-[#2c3f8f]">
            <svg fill="currentColor" height="340" viewBox="0 0 100 100" width="340">
              <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="3 3" strokeWidth="2"></circle>
              <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="1.5"></path>
              <circle cx="50" cy="50" fill="none" r="22" stroke="currentColor" strokeWidth="1"></circle>
              <path d="M50 28 Q55 45 72 50 Q55 55 50 72 Q45 55 28 50 Q45 45 50 28 Z" fill="currentColor"></path>
            </svg>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b4801f]"></span>
                <span className="text-[0.72rem] uppercase font-bold tracking-wider text-[#5a5f78]">
                  ဖောက်သည်စာရင်းဇယား · Client Directory
                </span>
              </div>
              <h1 className="text-[1.375rem] sm:text-[1.5rem] font-bold text-[#1a1d2e] tracking-tight font-display">
                Customer များ စီမံခန့်ခွဲမှု
              </h1>
              <p className="text-[0.84375rem] text-[#5a5f78] mt-1 max-w-2xl">
                လက်လီ၊ လက်ကားနှင့် အထူး VIP ဖောက်သည်များ၏ ဖုန်းအော်ဒါ၊ ဝယ်ယူမှုမှတ်တမ်းနှင့် စိတ်ကြိုက် ပါတိတ်ဒီဇိုင်းမှတ်စုများ
              </p>
            </div>

            {/* Quick Summary Metrics Bento */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              <div className="bg-[#eceef5] px-3.5 py-2.5 rounded-lg flex flex-col min-w-[100px] border border-[#dcdfea]">
                <span className="text-[0.7rem] text-[#5a5f78]">စုစုပေါင်းဝယ်သူ</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[1.5rem] font-mono font-bold text-[#132373]">{customers.length}</span>
                  <span className="text-[0.72rem] text-[#5a5f78]">ယောက်</span>
                </div>
              </div>

              <div className="bg-[#eceef5] px-3.5 py-2.5 rounded-lg flex flex-col min-w-[110px] border border-[#dcdfea]">
                <span className="text-[0.7rem] text-[#5a5f78]">VIP ဖောက်သည်</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[1.5rem] font-mono font-bold text-[#835500]">3</span>
                  <span className="text-[0.72rem] text-[#835500] font-bold">ဦး</span>
                </div>
              </div>

              <div className="bg-[#eceef5] px-3.5 py-2.5 rounded-lg flex flex-col min-w-[130px] border border-[#dcdfea]">
                <span className="text-[0.7rem] text-[#5a5f78]">စုစုပေါင်းရောင်းရငွေ</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[1.1rem] sm:text-[1.25rem] font-mono font-bold text-[#2a7146]">
                    4,285,000
                  </span>
                  <span className="text-[0.72rem] text-[#5a5f78]">Ks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Action Toolbar */}
      <section className="px-4 sm:px-6 pt-4">
        <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Inputs */}
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#5a5f78] text-[19px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="နာမည် / ဖုန်း / မြို့ ရှာရန်..."
                className="w-full h-9 pl-9 pr-3 bg-[#eceef5] focus:bg-white text-[#1a1d2e] placeholder:text-[#5a5f78] rounded-lg text-[0.84375rem] focus:outline-none border border-[#dcdfea] focus:border-[#132373] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* City Select */}
              <div className="relative min-w-[130px]">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full h-9 px-3 pr-8 bg-[#eceef5] text-[#1a1d2e] rounded-lg text-[0.78125rem] appearance-none focus:outline-none cursor-pointer border border-[#dcdfea]"
                >
                  <option value="all">မြို့နယ်အားလုံး</option>
                  <option value="ရန်ကုန်">ရန်ကုန်</option>
                  <option value="မန္တလေး">မန္တလေး</option>
                  <option value="နေပြည်တော်">နေပြည်တော်</option>
                  <option value="တောင်ကြီး">တောင်ကြီး</option>
                  <option value="မော်လမြိုင်">မော်လမြိုင်</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#5a5f78] text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Tag Filter */}
              <div className="relative min-w-[120px]">
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full h-9 px-3 pr-8 bg-[#eceef5] text-[#1a1d2e] rounded-lg text-[0.78125rem] appearance-none focus:outline-none cursor-pointer border border-[#dcdfea]"
                >
                  <option value="all">Tag အားလုံး</option>
                  <option value="VIP">⭐ VIP ဖောက်သည်</option>
                  <option value="Wholesale">📦 လက်ကား (Wholesale)</option>
                  <option value="Regular">လက်လီ (Retail)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#5a5f78] text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportClientCSV}
              className="h-9 px-3 rounded-lg bg-[#eceef5] hover:bg-[#dde1ff] text-[#1a1d2e] text-[0.78125rem] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#dcdfea]"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px] text-[#5a5f78]">download</span>
              <span>စာရင်းထုတ်ယူရန်</span>
            </button>

            <button
              onClick={() => openDrawer(customers[0], true)}
              className="h-9 px-3.5 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white text-[0.78125rem] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_call</span>
              <span>+ ဖုန်း order အသစ်ဖွင့်</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout (Table & Embedded Preview) */}
      <section className="px-4 sm:px-6 py-5 flex flex-col xl:flex-row gap-5 items-start">
        {/* Customers Table Card */}
        <div className="w-full xl:flex-1 bg-white rounded-xl shadow-xs border border-[#dcdfea] overflow-hidden">
          {/* Table Header & Counter */}
          <div className="px-4 sm:px-5 py-3 bg-[#eceef5] flex items-center justify-between border-b border-[#dcdfea]">
            <div className="flex items-center gap-2">
              <span className="text-[0.9375rem] font-bold text-[#1a1d2e]">ဝယ်ယူသူစာရင်း</span>
              <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#dee0ff] text-[#132373] font-bold">
                {filteredCustomers.length} ယောက်
              </span>
            </div>
            <div className="text-[0.75rem] text-[#5a5f78] font-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">touch_app</span>
              <span>အတန်းကိုနှိပ်၍ အသေးစိတ်စစ်ဆေးပါ</span>
            </div>
          </div>

          {/* Table View */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#eceef5] text-[#5a5f78] text-[0.72rem] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 pl-4 pr-3">ဝယ်သူအမည် & အဆင့်</th>
                  <th className="py-2.5 px-3">ဖုန်းနံပါတ်</th>
                  <th className="py-2.5 px-3">မြို့နယ်</th>
                  <th className="py-2.5 px-3 text-center">ကြိမ်ရေ (Orders)</th>
                  <th className="py-2.5 px-3 text-right">စုစုပေါင်းဝယ်ငွေ</th>
                  <th className="py-2.5 pr-4 pl-3 text-right">လုပ်ဆောင်ချက်</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef5] text-[0.84375rem]">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#5a5f78]">
                      ရှာဖွေတွေ့ရှိမှု မရှိပါ။ အခြား အမည် သို့မဟုတ် မြို့နယ်ဖြင့် စစ်ဆေးကြည့်ပါ။
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => openDrawer(c)}
                      className="group cursor-pointer hover:bg-[#eceef5] transition-colors duration-150"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 pl-4 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full ${c.avatarBg} text-white flex items-center justify-center font-bold text-[0.9375rem] shrink-0 shadow-xs`}
                          >
                            {c.initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#1a1d2e] group-hover:text-[#132373] transition-colors">
                              {c.name}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              {c.tag === 'VIP' && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-[#f5ead3] text-[#835500] text-[0.7rem] font-bold">
                                  <span className="material-symbols-outlined text-[12px]">verified</span>{' '}
                                  {c.tagLabel}
                                </span>
                              )}
                              {c.tag === 'Wholesale' && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-[#dde1ff] text-[#132373] text-[0.7rem] font-bold">
                                  လက်ကား
                                </span>
                              )}
                              {c.tag === 'Regular' && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-[#eceef5] text-[#5a5f78] text-[0.7rem]">
                                  {c.tagLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3 font-mono text-[0.78125rem] text-[#1a1d2e] font-medium whitespace-nowrap">
                        {c.phone}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[#1a1d2e]">
                          <span className="material-symbols-outlined text-[15px] text-[#5a5f78]">location_on</span>
                          {c.city} ({c.district})
                        </span>
                      </td>

                      {/* Order Count */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#eceef5] text-[#1a1d2e] font-mono text-[0.75rem] font-bold">
                          {c.orderCount} ကြိမ်
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-3 text-right font-mono text-[0.84375rem] font-bold text-[#2c3f8f] whitespace-nowrap">
                        {c.totalSpent.toLocaleString()} Ks
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 pr-4 pl-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openDrawer(c, true)}
                          className="h-8 px-2.5 rounded-lg bg-[#eceef5] hover:bg-[#132373] hover:text-white text-[#1a1d2e] text-[0.75rem] font-bold inline-flex items-center gap-1 transition-all cursor-pointer border border-[#dcdfea]"
                          title="ဖုန်းအော်ဒါဖွင့်ရန်"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span>
                          <span className="hidden sm:inline">+ Order</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Metadata */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#eceef5] flex items-center justify-between text-[0.75rem] text-[#5a5f78] border-t border-[#dcdfea]">
            <span>နောက်ဆုံးရောင်းချမှု မွမ်းမံချိန်: ယနေ့ ၁၀:၄၅ AM</span>
            <span className="font-mono">Active Atelier Database · Sync Ok</span>
          </div>
        </div>

        {/* Right Side: Mini Highlights & Visual Showcase Card */}
        <div className="w-full xl:w-[360px] flex flex-col gap-4 shrink-0">
          {/* Batik Special Customer Loyalty Card */}
          <div className="bg-[#132373] text-white rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#bbc3ff]">
                  အထူး ပါတိတ် အစီအစဉ်
                </span>
                <span className="material-symbols-outlined text-[#ffddb4] text-[20px]">auto_awesome</span>
              </div>
              <h3 className="text-[1.15rem] font-bold font-display">ရွှေတံဆိပ် VIP ဖောက်သည်များ</h3>
              <p className="text-[0.75rem] text-white/80 mt-1 leading-relaxed">
                သဘာဝဆေးဆိုးပန်းရိုက် ကန့်သတ်အထည်အသစ် (Limited Artisan Batch) များကို ကြိုတင်ရွေးချယ်ခွင့်နှင့် 10% ထပ်ဆောင်းခံစားခွင့် ရရှိထားပါသည်။
              </p>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-[0.7rem] text-white/70 block">ယခုလ VIP မှာယူမှု</span>
                  <span className="text-[1rem] font-bold font-mono">1,240,000 Ks</span>
                </div>
                <button
                  onClick={() =>
                    onShowToast(
                      'VIP စည်းမျဉ်းများ',
                      '၁ လအတွင်း ၅ သိန်းကျပ်နှင့်အထက် မှာယူသော ဖောက်သည်များအား ရွှေတံဆိပ် VIP အဖြစ် အလိုအလျောက် အဆင့်မြှင့်တင်ပေးပါသည်။'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#dde1ff] text-[#132373] text-[0.75rem] font-bold hover:bg-white transition-colors cursor-pointer"
                  type="button"
                >
                  စည်းမျဉ်းများ
                </button>
              </div>
            </div>

            {/* Abstract Batik Wax Wave SVG */}
            <div className="absolute -right-6 -top-6 w-36 h-36 opacity-15 pointer-events-none">
              <svg fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,50 Q25,20 50,50 T100,50 Q75,80 50,50 T0,50 Z"></path>
              </svg>
            </div>
          </div>

          {/* Visual Motif / Workshop Snapshot */}
          <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-bold uppercase text-[#5a5f78]">
                လက်လုပ်ပါတိတ် မှာယူမှုများ
              </span>
              <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#dff0e5] text-[#2a7146] font-bold">
                Active Live
              </span>
            </div>

            <div className="relative rounded-lg overflow-hidden h-36 border border-[#dcdfea]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Ipza9v-CfU3gUvqqxYziPp-5-KbAQiwW4-O4sfi8TkVamQnPBZbUygolmLVrXtAmz08RKOSNq9Q4P2F_TaXUeKUfZxl9MrFVBcgocuHgi7R8KUCeURhGD7T84WGvCcpSJ1AFH-51l-NNuEOYTm-obZbXfWLExvFqzpeZymSZLl2uPFDSlsHSPnJiFa3DKTWKyAyjuBlR5U3GTL2XrPfd0YhF2lpBASz9bSEgaHbmnZxZq-IjQaNFHg"
                alt="Batik Tjanting Artisan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                <div className="text-white">
                  <span className="text-[0.75rem] block font-semibold">
                    လက်ဆွဲ ဖယောင်းရိုက် ကန့်သတ်အထည်များ
                  </span>
                  <span className="font-mono text-[0.7rem] opacity-90">Batch #SHS-2024-B8</span>
                </div>
              </div>
            </div>

            <div className="bg-[#eceef5] p-2.5 rounded-lg flex items-center justify-between text-[0.75rem] border border-[#dcdfea]">
              <span className="text-[#5a5f78]">ဖုန်းအော်ဒါ လျင်မြန်စွာသွင်းယူရန်</span>
              <button
                onClick={() => openDrawer(selectedCustomer, true)}
                className="text-[#132373] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                type="button"
              >
                စတင်ရန် <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FLYOUT INSPECTION & QUICK PHONE ORDER DRAWER (Slide-over) */}
      {isDrawerOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Click to dismiss overlay */}
          <div
            className="fixed inset-0 bg-[#121528]/50 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Panel Container */}
          <aside className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-2xl flex flex-col z-50 border-l border-[#dcdfea]">
            {/* Drawer Header */}
            <div className="px-5 py-4 bg-[#eceef5] flex items-center justify-between shrink-0 border-b border-[#dcdfea]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedCustomer.avatarBg} text-white text-[1.15rem] font-bold flex items-center justify-center shadow-xs`}
                >
                  {selectedCustomer.initial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[1.1rem] font-bold text-[#1a1d2e] font-display">
                      {selectedCustomer.name}
                    </h2>
                    <span className="text-[0.72rem] px-2 py-0.5 rounded-full bg-[#f5ead3] text-[#835500] font-bold">
                      {selectedCustomer.tagLabel}
                    </span>
                  </div>
                  <p className="font-mono text-[0.75rem] text-[#5a5f78]">{selectedCustomer.phone}</p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#dde1ff] text-[#5a5f78] flex items-center justify-center transition-colors cursor-pointer border border-[#dcdfea]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="px-5 pt-2 bg-[#eceef5] flex gap-4 shrink-0 border-b border-[#dcdfea]">
              <button
                onClick={() => setDrawerTab('details')}
                className={`pb-2.5 text-[0.84375rem] font-bold transition-all relative cursor-pointer ${
                  drawerTab === 'details' ? 'text-[#132373]' : 'text-[#5a5f78] hover:text-[#1a1d2e]'
                }`}
              >
                <span>အချက်အလက် & မှတ်တမ်း</span>
                {drawerTab === 'details' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#132373]" />
                )}
              </button>

              <button
                onClick={() => setDrawerTab('order')}
                className={`pb-2.5 text-[0.84375rem] font-bold transition-all relative flex items-center gap-1 cursor-pointer ${
                  drawerTab === 'order' ? 'text-[#132373]' : 'text-[#5a5f78] hover:text-[#1a1d2e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#b4801f]">phone_in_talk</span>
                <span>+ ဖုန်း order သွင်းယူရန်</span>
                {drawerTab === 'order' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#132373]" />
                )}
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* VIEW 1: Profile, Notes & History View */}
              {drawerTab === 'details' ? (
                <div className="space-y-4">
                  {/* Contact & Shipping Address Block */}
                  <div className="bg-[#eceef5] p-3.5 rounded-xl space-y-2.5 border border-[#dcdfea]">
                    <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                      လိပ်စာ & ဆက်သွယ်ရန် ချန်နယ်များ
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#2c3f8f] text-[18px] shrink-0 mt-0.5">
                          home_pin
                        </span>
                        <div>
                          <span className="text-[0.72rem] text-[#5a5f78] block">ပို့ဆောင်ရမည့်လိပ်စာ</span>
                          <span className="text-[0.8125rem] text-[#1a1d2e] font-semibold">
                            {selectedCustomer.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#2a7146] text-[18px] shrink-0 mt-0.5">
                          chat
                        </span>
                        <div>
                          <span className="text-[0.72rem] text-[#5a5f78] block">Viber / Messenger</span>
                          <span className="text-[0.8125rem] text-[#1a1d2e] font-semibold">
                            {selectedCustomer.social}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Spending & Orders summary */}
                    <div className="pt-2 flex items-center justify-between text-[#1a1d2e] border-t border-[#dcdfea]">
                      <div className="flex flex-col">
                        <span className="text-[0.72rem] text-[#5a5f78]">စုစုပေါင်း မှာယူပြီးငွေ</span>
                        <span className="text-[1rem] font-bold font-mono text-[#2c3f8f]">
                          {selectedCustomer.totalSpent.toLocaleString()} Ks
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[0.72rem] text-[#5a5f78]">အောင်မြင်ပြီး အော်ဒါ</span>
                        <span className="text-[1rem] font-bold font-mono text-[#2a7146]">
                          {selectedCustomer.orderCount} ကြိမ်
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Tags / Badge Editor */}
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                      သတ်မှတ်ချက် Tags များ
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-full bg-[#f5ead3] text-[#835500] text-[0.75rem] font-bold flex items-center gap-1">
                        ⭐ {selectedCustomer.tagLabel}
                      </span>
                      {selectedCustomer.tagSub && (
                        <span className="px-2.5 py-1 rounded-full bg-[#dde1ff] text-[#132373] text-[0.75rem] font-bold">
                          📦 {selectedCustomer.tagSub}
                        </span>
                      )}
                      <button
                        onClick={() =>
                          onShowToast(
                            'Tag စနစ်',
                            'ဖောက်သည်အတွက် Tag အသစ် (ဥပမာ: VIP Gold, Regular, Bulk Purchaser) သတ်မှတ်နိုင်ပါသည်။'
                          )
                        }
                        className="px-2.5 py-1 rounded-full bg-[#eceef5] hover:bg-[#dde1ff] text-[#5a5f78] text-[0.75rem] font-semibold flex items-center gap-1 cursor-pointer border border-[#dcdfea]"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span> Tag အသစ်ထည့်
                      </button>
                    </div>
                  </div>

                  {/* Customer Preference Notes Textarea with auto-save */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                        ပါတိတ် စိတ်ကြိုက်အရောင် & မှတ်ချက်များ
                      </label>
                      <span className="text-[0.7rem] text-[#2a7146] font-semibold">
                        {noteSaveStatus}
                      </span>
                    </div>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:bg-white border border-[#dcdfea] focus:border-[#132373] focus:outline-none transition-colors"
                      placeholder="ဖောက်သည်ကြိုက်နှစ်သက်သော သဘာဝဆေးဆိုးရောင် (Indigo, Madder red) နှင့် ထည်အရွယ်အစားမှတ်ချက်များ ရေးသားရန်..."
                    />
                  </div>

                  {/* Past Order Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                        ယခင်မှာယူမှု မှတ်တမ်း (Order Timeline)
                      </span>
                      <span className="font-mono text-[0.72rem] text-[#5a5f78]">
                        {selectedCustomer.timeline.length} ခုပြသထားသည်
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedCustomer.timeline.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#eceef5] flex items-start justify-between border border-[#dcdfea]"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2c3f8f] shrink-0 mt-0.5 border border-[#dcdfea]">
                              <span className="material-symbols-outlined text-[18px]">receipt</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[0.78125rem] font-bold text-[#132373]">
                                  {item.code}
                                </span>
                                <span className="text-[0.7rem] px-2 py-0.2 rounded-full bg-[#dff0e5] text-[#2a7146] font-bold">
                                  {item.status}
                                </span>
                              </div>
                              <span className="text-[0.75rem] text-[#5a5f78] block mt-0.5">
                                {item.desc}
                              </span>
                              <span className="font-mono text-[0.72rem] text-[#5a5f78]">{item.date}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[0.78125rem] font-bold text-[#1a1d2e] whitespace-nowrap">
                            {item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW 2: Quick Phone Order Entry Form */
                <div className="space-y-3.5">
                  <div className="bg-[#dde1ff] p-3 rounded-xl text-[#132373] border border-[#bbc3ff]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                      <span className="text-[0.84375rem] font-bold">ဖုန်းအော်ဒါ အမြန်ဖွင့်ရန်</span>
                    </div>
                    <p className="text-[0.72rem] leading-relaxed">
                      အောက်ပါ အချက်အလက်များတွင် ဖောက်သည်၏ အမည်၊ ဖုန်း နှင့် ပို့ဆောင်ရမည့်လိပ်စာများကို အလိုအလျောက် ဖြည့်စွက်ပေးထားပါသည်။
                    </p>
                  </div>

                  {/* Pre-filled info card */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">ဝယ်ယူသူ</label>
                      <input
                        type="text"
                        value={selectedCustomer.name}
                        readOnly
                        className="w-full h-9 px-3 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] font-semibold border border-[#dcdfea] cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">ဖုန်းနံပါတ်</label>
                      <input
                        type="text"
                        value={selectedCustomer.phone}
                        readOnly
                        className="w-full h-9 px-3 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] font-mono font-semibold border border-[#dcdfea] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-1">
                    <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                      ပါတိတ်ပစ္စည်း ရွေးချယ်ရန်
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProductPrice}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setSelectedProductPrice(val);
                          const text = e.target.options[e.target.selectedIndex].text.split(' - ')[0];
                          setSelectedProductTitle(text);
                        }}
                        className="w-full h-9 px-3 pr-8 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:bg-white border border-[#dcdfea] focus:border-[#132373] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value={120000}>ရွှေနှင်းဆီ ပိုးပါတိတ် (သဘာဝအင်ဒီဂိုပြာ) - 120,000 Ks</option>
                        <option value={95000}>ပုဂံရှေးဟောင်း စဉ့်ထည်ဒီဇိုင်း ချည်ပါတိတ် - 95,000 Ks</option>
                        <option value={145000}>တော်ဝင် သစ်ခွနီ ဖယောင်းဆွဲပုဆိုး - 145,000 Ks</option>
                        <option value={80000}>ရွှေဘိုရိုးရာ ဝါဂွမ်းစစ်လုံချည် - 80,000 Ks</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#5a5f78] text-[18px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Delivery service */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                        အရေအတွက် (ထည်)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={orderQty}
                        onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-9 px-3 bg-[#eceef5] focus:bg-white rounded-lg font-mono text-[0.84375rem] text-[#1a1d2e] border border-[#dcdfea] focus:border-[#132373] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                        ပို့ဆောင်ရေး ဂိတ် / အိမ်အရောက်
                      </label>
                      <div className="relative">
                        <select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="w-full h-9 px-3 pr-8 bg-[#eceef5] rounded-lg text-[0.75rem] text-[#1a1d2e] border border-[#dcdfea] focus:bg-white focus:outline-none appearance-none cursor-pointer"
                        >
                          <option>Royal Express (အိမ်အရောက်)</option>
                          <option>အောင်မင်္ဂလာ အဝေးပြေးဂိတ်</option>
                          <option>မန္တလေး ဒိုင်းမွန်းဂိတ်တင်</option>
                          <option>ဆိုင်သို့ လူကိုယ်တိုင်လာယူမည်</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#5a5f78] text-[18px] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1">
                    <label className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                      ပို့ဆောင်မည့် လိပ်စာအပြည့်အစုံ
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#eceef5] focus:bg-white rounded-lg text-[0.8125rem] text-[#1a1d2e] border border-[#dcdfea] focus:border-[#132373] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Order Summary Well */}
                  <div className="bg-[#eceef5] p-3.5 rounded-xl space-y-1.5 border border-[#dcdfea]">
                    <div className="flex items-center justify-between text-[0.75rem] text-[#5a5f78]">
                      <span>ပစ္စည်းကျသင့်ငွေ:</span>
                      <span className="font-mono font-medium text-[#1a1d2e]">
                        {orderSubtotal.toLocaleString()} Ks
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[0.75rem] text-[#5a5f78]">
                      <span>ပို့ခ (Delivery Fee):</span>
                      <span className="font-mono font-medium text-[#1a1d2e]">
                        {deliveryFee.toLocaleString()} Ks
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[0.75rem] text-[#835500] font-semibold">
                      <span>VIP လျှော့စျေး (10%):</span>
                      <span className="font-mono">
                        {orderDiscount > 0 ? `-${orderDiscount.toLocaleString()} Ks` : '0 Ks'}
                      </span>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-[#dcdfea]">
                      <span className="text-[0.9375rem] font-bold text-[#1a1d2e]">ကျသင့်ငွေ စုစုပေါင်း:</span>
                      <span className="text-[1.25rem] font-mono font-bold text-[#132373]">
                        {orderGrandTotal.toLocaleString()} Ks
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Sticky Action Bar */}
            <div className="p-4 bg-[#eceef5] shrink-0 flex items-center justify-between gap-3 border-t border-[#dcdfea]">
              {drawerTab === 'details' ? (
                <div className="w-full flex items-center justify-between">
                  <button
                    onClick={closeDrawer}
                    className="h-9 px-4 rounded-lg bg-white hover:bg-[#dde1ff] text-[#1a1d2e] text-[0.78125rem] font-bold border border-[#dcdfea] transition-colors cursor-pointer"
                    type="button"
                  >
                    ပိတ်မည်
                  </button>
                  <button
                    onClick={() => setDrawerTab('order')}
                    className="h-9 px-5 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white text-[0.78125rem] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    <span>+ ဖုန်း order ထည့်</span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <button
                    onClick={() => setDrawerTab('details')}
                    className="h-9 px-4 rounded-lg bg-white hover:bg-[#dde1ff] text-[#1a1d2e] text-[0.78125rem] font-bold border border-[#dcdfea] transition-colors cursor-pointer"
                    type="button"
                  >
                    နောက်သို့
                  </button>
                  <button
                    onClick={handleConfirmPhoneOrder}
                    className="h-9 px-6 rounded-lg bg-[#2a7146] hover:bg-[#004d28] text-white text-[0.78125rem] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>အော်ဒါ အတည်ပြုမည်</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
