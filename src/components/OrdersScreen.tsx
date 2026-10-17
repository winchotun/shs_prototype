import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';

interface OrdersScreenProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string | null) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  onOpenNewOrderModal: () => void;
  onOpenSlipZoom: (imageUrl: string, title: string, amount: string) => void;
  onShowToast: (title: string, message: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onUpdateOrderStatus,
  onOpenNewOrderModal,
  onOpenSlipZoom,
  onShowToast,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [staffNote, setStaffNote] = useState('');

  // Selected order details
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) {
      return orders.find((o) => o.orderNumber === '#1030') || orders[0];
    }
    return orders.find((o) => o.id === selectedOrderId || o.orderNumber === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  // Sync staff note when selected order changes
  React.useEffect(() => {
    if (selectedOrder) {
      setStaffNote(selectedOrder.internalNote || '');
    }
  }, [selectedOrder]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status tab
      if (activeStatusTab !== 'all') {
        if (order.status !== activeStatusTab) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone.toLowerCase().includes(q);
        if (!matchesNumber && !matchesName && !matchesPhone) return false;
      }

      // Channel
      if (channelFilter !== 'all') {
        if (channelFilter === 'online' && order.channel !== 'online') return false;
        if (channelFilter === 'phone' && order.channel === 'online') return false;
      }

      // Payment
      if (paymentFilter !== 'all') {
        if (paymentFilter === 'kpay' && !order.paymentMethod.startsWith('kpay')) return false;
        if (paymentFilter === 'wave' && !order.paymentMethod.startsWith('wave')) return false;
        if (paymentFilter === 'aya' && order.paymentMethod !== 'ayapay') return false;
        if (paymentFilter === 'cod' && order.paymentMethod !== 'cod') return false;
      }

      return true;
    });
  }, [orders, activeStatusTab, searchQuery, channelFilter, paymentFilter]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      awaiting_payment: 0,
      review: 0,
      confirmed: 0,
      packing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Channel', 'Items', 'Total (Ks)', 'Payment Method', 'Status', 'Date'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerAddress.replace(/"/g, '""')}"`,
      o.channelLabel,
      `"${o.items.map((i) => `${i.title} (${i.qty})`).join(', ')}"`,
      o.totalAmount,
      o.paymentMethodLabel,
      o.statusLabel,
      `"${o.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shwe_hnin_si_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Excel/CSV ဖိုင် ထုတ်ယူပြီး', `Order ${filteredOrders.length} ခု၏ အချက်အလက်များကို အောင်မြင်စွာ ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ။`);
  };

  const handleConfirmOrder = () => {
    if (!selectedOrder) return;
    onUpdateOrderStatus(selectedOrder.id, 'confirmed', staffNote);
    onShowToast('ငွေလွှဲ အတည်ပြုပြီးပါပြီ', `Order ${selectedOrder.orderNumber} ၏ စလစ်မှန်ကန်ကြောင်း အတည်ပြုပြီး Paid အဆင့်သို့ ပြောင်းလဲလိုက်ပါသည်။`);
  };

  const handleRejectOrder = () => {
    if (!selectedOrder) return;
    const reason = prompt('Reject လုပ်ရသည့် အကြောင်းပြချက် ရေးသားပါ (ဥပမာ: ငွေမဝင်သေးပါ / စလစ်ပုံ မရှင်းလင်းပါ):', 'ငွေလွှဲငွေပမာဏ မကိုက်ညီပါ');
    if (reason !== null) {
      onUpdateOrderStatus(selectedOrder.id, 'cancelled', `ငြင်းပယ်ရခြင်း: ${reason}`);
      onShowToast('အော်ဒါ ငြင်းပယ်ပြီးပါပြီ', `Order ${selectedOrder.orderNumber} ကို ငြင်းပယ်ပြီး ပယ်ဖျက်စာရင်းသို့ ထည့်သွင်းလိုက်ပါသည်။`);
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-4 sm:px-6 py-5 flex flex-col gap-5 max-w-[1440px] mx-auto w-full">
        {/* Top Action Bar & Metrics Ribbon */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 z-10">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[1.25rem] font-bold text-[#1a1d2e] tracking-tight font-display">
                Order စီမံခန့်ခွဲမှုစနစ်
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eceef5] text-[#5a5f78] text-[0.75rem] font-mono">
                <span className="material-symbols-outlined text-[14px] text-[#2a7146]">sync</span>
                Live Sync
              </span>
            </div>
            <p className="text-[0.84375rem] text-[#5a5f78]">
              လက်မှုပါတိတ် အထည်အော်ဒါများ၊ ငွေလွှဲစလစ် စစ်ဆေးခြင်းနှင့် ပို့ဆောင်ရေးအခြေအနေ
            </p>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            {/* Auto-Expiry Warning Notice */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faeed3] text-[#8d5c08] text-[0.75rem] font-medium shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-[#8d5c08] shrink-0">timer</span>
              <span>Online order ငွေမလွှဲရင် ၃၀ မိနစ်အကြာ auto ပယ်ဖျက်မည်</span>
            </div>

            {/* Export Excel Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-[#1a1d2e] border border-[#dcdfea] shadow-xs hover:bg-[#eceef5] transition-all text-[0.84375rem] font-medium cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#5a5f78]">file_download</span>
              <span>Export Excel</span>
            </button>

            {/* Primary New Order Button */}
            <button
              onClick={onOpenNewOrderModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2d3b8a] text-white font-semibold text-[0.84375rem] shadow-sm hover:bg-[#132373] transition-all cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ ဖုန်း order ထည့်</span>
            </button>
          </div>
        </div>

        {/* Mini KPI Stat Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 z-10">
          <div className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-xs border border-[#dcdfea]">
            <div className="flex flex-col">
              <span className="text-[0.72rem] text-[#5a5f78] uppercase font-semibold">ယနေ့ စုစုပေါင်း Order</span>
              <span className="text-[1.625rem] font-mono font-bold text-[#1a1d2e] tracking-tight">
                {orders.length} <span className="text-[0.75rem] text-[#5a5f78] font-normal">စောင်</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#eceef5] flex items-center justify-center text-[#132373]">
              <span className="material-symbols-outlined text-[22px]">receipt</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-xs border border-[#faeed3]">
            <div className="flex flex-col">
              <span className="text-[0.72rem] text-[#5a5f78] uppercase font-semibold">စစ်ဆေးရန်ကျန် (Review)</span>
              <span className="text-[1.625rem] font-mono font-bold text-[#8d5c08] tracking-tight">
                {statusCounts.review}{' '}
                <span className="text-[0.75rem] text-[#5a5f78] font-normal">စောင်</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#faeed3] flex items-center justify-center text-[#8d5c08]">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-xs border border-[#dff0e5]">
            <div className="flex flex-col">
              <span className="text-[0.72rem] text-[#5a5f78] uppercase font-semibold">ယနေ့ ရောင်းရငွေ (ကျပ်)</span>
              <span className="text-[1.625rem] font-mono font-bold text-[#2a7146] tracking-tight">
                645,000
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#dff0e5] flex items-center justify-center text-[#2a7146]">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-xs border border-[#dde1ff]">
            <div className="flex flex-col">
              <span className="text-[0.72rem] text-[#5a5f78] uppercase font-semibold">ထုပ်ပိုး / ပို့ဆောင်ဆဲ</span>
              <span className="text-[1.625rem] font-mono font-bold text-[#2c3f8f] tracking-tight">
                2 <span className="text-[0.75rem] text-[#5a5f78] font-normal">ပါဆယ်</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#e2e5f5] flex items-center justify-center text-[#2d3b8a]">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Panel */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#dcdfea] flex flex-col gap-3 z-10">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'အားလုံး', count: statusCounts.all, color: 'bg-white/20' },
              { id: 'awaiting_payment', label: 'ငွေစောင့်ဆဲ', count: statusCounts.awaiting_payment, color: 'bg-[#faeed3] text-[#8d5c08]' },
              { id: 'review', label: 'စစ်ဆေးရန် (Review)', count: statusCounts.review, color: 'bg-[#e2e5f5] text-[#2c3f8f]' },
              { id: 'confirmed', label: 'အတည်ပြုပြီး', count: statusCounts.confirmed, color: 'bg-[#dff0e5] text-[#2a7146]' },
              { id: 'packing', label: 'ထုပ်ပိုးနေ', count: statusCounts.packing, color: 'bg-[#f5ead3] text-[#835500]' },
              { id: 'shipped', label: 'ပို့ပြီး', count: statusCounts.shipped, color: 'bg-[#e2e5f5] text-[#132373]' },
              { id: 'delivered', label: 'ရောက်ပြီး', count: statusCounts.delivered, color: 'bg-[#dff0e5] text-[#2a7146]' },
              { id: 'cancelled', label: 'ပယ်ဖျက်', count: statusCounts.cancelled, color: 'bg-[#f9e1de] text-[#ad3229]' },
            ].map((tab) => {
              const isActive = activeStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatusTab(tab.id as OrderStatus)}
                  className={`px-3 py-1.5 rounded-lg text-[0.84375rem] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#132373] text-white shadow-xs'
                      : 'bg-[#eceef5] hover:bg-[#dde1ff] text-[#1a1d2e]'
                  }`}
                  type="button"
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-mono text-[0.72rem] ${
                      isActive ? 'bg-white/20 text-white' : tab.color
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls Row: Search, Channel Dropdown, Payment Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center pt-1">
            {/* Search Input */}
            <div className="md:col-span-6 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5a5f78] text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order # ID ၊ အမည် သို့မဟုတ် ဖုန်းနံပါတ် ဖြင့်ရှာဖွေရန်..."
                className="w-full h-10 pl-9 pr-3 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#132373] border border-transparent focus:border-[#dcdfea] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#5a5f78] hover:text-[#1a1d2e] text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Channel Filter */}
            <div className="md:col-span-3 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5a5f78] text-[18px] pointer-events-none">
                hub
              </span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-7 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:outline-none focus:bg-white border border-transparent focus:border-[#dcdfea] cursor-pointer appearance-none transition-all"
              >
                <option value="all">Channel အားလုံး (All Channels)</option>
                <option value="online">Online Web Store (ဝက်ဘ်ဆိုက်)</option>
                <option value="phone">ဖုန်း / Viber / Messenger</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-[#5a5f78] text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>

            {/* Payment Filter */}
            <div className="md:col-span-3 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5a5f78] text-[18px] pointer-events-none">
                account_balance_wallet
              </span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-7 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:outline-none focus:bg-white border border-transparent focus:border-[#dcdfea] cursor-pointer appearance-none transition-all"
              >
                <option value="all">ငွေပေးချေမှု နည်းလမ်းအားလုံး</option>
                <option value="kpay">KBZPay QR / လွှဲငွေ</option>
                <option value="wave">WavePay</option>
                <option value="aya">AYA Pay</option>
                <option value="cod">Cash on Delivery (COD)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-[#5a5f78] text-[18px] pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>

        {/* Main Workspace Split: Table Area + Side Inspection Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start z-10">
          {/* Orders Table Container */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-white rounded-xl shadow-xs border border-[#dcdfea] overflow-hidden">
            <div className="px-4 sm:px-5 py-3 bg-white flex items-center justify-between border-b border-[#dcdfea]">
              <div className="flex items-center gap-2">
                <span className="text-[0.9375rem] font-bold text-[#1a1d2e]">Order စာရင်းရလဒ်</span>
                <span className="text-[0.75rem] text-[#5a5f78]">ပြသနေသည် {filteredOrders.length} ခု</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#5a5f78] text-[0.75rem]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#2a7146] animate-pulse"></span>
                <span>Realtime Updates Active</span>
              </div>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eceef5] text-[#5a5f78] text-[0.72rem] uppercase font-semibold tracking-wider">
                    <th className="py-2.5 px-3 font-mono">Order ID & အချိန်</th>
                    <th className="py-2.5 px-3">ဝယ်ယူသူ (Customer)</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">ပစ္စည်း အထည်များ</th>
                    <th className="py-2.5 px-3 text-right">ကျသင့်ငွေ</th>
                    <th className="py-2.5 px-3">ငွေပေးချေမှု</th>
                    <th className="py-2.5 px-3">အခြေအနေ (Status)</th>
                    <th className="py-2.5 px-2 text-center">လုပ်ဆောင်ချက်</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef5] text-[0.84375rem]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#5a5f78]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[32px] text-[#5a5f78]/60">
                            inventory_2
                          </span>
                          <span className="font-semibold text-sm">ကိုက်ညီသော Order မတွေ့ရှိပါ</span>
                          <span className="text-xs">Search သို့မဟုတ် Filter ကို ပြန်လည်စစ်ဆေးပါ</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => onSelectOrder(order.id)}
                          className={`hover:bg-[#eceef5]/80 transition-colors cursor-pointer relative ${
                            isSelected ? 'bg-[#132373]/5 font-medium' : ''
                          }`}
                        >
                          {/* Order ID & Time */}
                          <td className="py-3 px-3 whitespace-nowrap relative">
                            {isSelected && (
                              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#132373]" />
                            )}
                            <div className="flex flex-col">
                              <span
                                className={`font-mono text-[0.78125rem] font-bold ${
                                  isSelected ? 'text-[#132373]' : 'text-[#2d3b8a]'
                                }`}
                              >
                                {order.orderNumber}
                              </span>
                              <span className="text-[0.72rem] text-[#5a5f78]">{order.timeAgo}</span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#1a1d2e]">{order.customerName}</span>
                              <span className="font-mono text-[0.72rem] text-[#5a5f78]">{order.customerPhone}</span>
                            </div>
                          </td>

                          {/* Channel */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {order.channel === 'online' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dde1ff] text-[#132373] text-[0.72rem] font-semibold">
                                <span className="material-symbols-outlined text-[13px]">language</span> Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f5ead3] text-[#835500] text-[0.72rem] font-semibold">
                                <span className="material-symbols-outlined text-[13px]">phone_in_talk</span>{' '}
                                {order.channelLabel}
                              </span>
                            )}
                          </td>

                          {/* Product Items */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {order.items[0] && (
                                <div className="w-8 h-8 rounded bg-[#eceef5] overflow-hidden shrink-0 shadow-xs border border-[#dcdfea]">
                                  <img
                                    src={order.items[0].image}
                                    alt={order.items[0].title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <span className="text-[0.78125rem] text-[#5a5f78] truncate max-w-[140px]">
                                {order.items[0]?.title} {order.items.length > 1 ? `(+${order.items.length - 1})` : ''}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-bold text-[#1a1d2e]">
                            {order.totalAmount.toLocaleString()} Ks
                          </td>

                          {/* Payment */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-[0.75rem] text-[#5a5f78] flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  order.paymentMethod.startsWith('wave')
                                    ? 'bg-[#8d5c08]'
                                    : order.paymentMethod.startsWith('kpay')
                                    ? 'bg-[#2c3f8f]'
                                    : order.paymentMethod === 'cod'
                                    ? 'bg-[#2b2b31]'
                                    : 'bg-[#5a5f78]'
                                }`}
                              />
                              {order.paymentMethodLabel}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.72rem] font-bold ${
                                order.status === 'review'
                                  ? 'bg-[#e2e5f5] text-[#2c3f8f]'
                                  : order.status === 'confirmed'
                                  ? 'bg-[#dff0e5] text-[#2a7146]'
                                  : order.status === 'packing'
                                  ? 'bg-[#f5ead3] text-[#835500]'
                                  : order.status === 'shipped'
                                  ? 'bg-[#e2e5f5] text-[#132373]'
                                  : order.status === 'delivered'
                                  ? 'bg-[#dff0e5] text-[#2a7146]'
                                  : order.status === 'awaiting_payment'
                                  ? 'bg-[#faeed3] text-[#8d5c08]'
                                  : 'bg-[#f9e1de] text-[#ad3229]'
                              }`}
                            >
                              {order.status === 'review' && (
                                <span className="material-symbols-outlined text-[14px]">find_in_page</span>
                              )}
                              {order.status === 'confirmed' && (
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              )}
                              {order.status === 'packing' && (
                                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                              )}
                              {order.status === 'shipped' && (
                                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                              )}
                              {order.status === 'delivered' && (
                                <span className="material-symbols-outlined text-[14px]">done_all</span>
                              )}
                              {order.status === 'awaiting_payment' && (
                                <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                              )}
                              {order.status === 'cancelled' && (
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                              )}
                              {order.statusLabel}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-2 text-center whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectOrder(order.id);
                              }}
                              className="p-1 rounded text-[#5a5f78] hover:text-[#132373] hover:bg-[#eceef5] cursor-pointer"
                              title="အသေးစိတ်ကြည့်"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="px-4 sm:px-5 py-3 bg-[#eceef5] flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-[#dcdfea]">
              <div className="text-[0.75rem] text-[#5a5f78]">
                မျက်နှာဖုံး ၁ / စုစုပေါင်း အော်ဒါ {filteredOrders.length} ခု ပြသထားသည်
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="w-8 h-8 rounded bg-white border border-[#dcdfea] flex items-center justify-center text-[#5a5f78] disabled:opacity-40 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  className="w-8 h-8 rounded bg-[#132373] text-white font-mono text-[0.78125rem] font-bold flex items-center justify-center shadow-xs"
                  type="button"
                >
                  1
                </button>
                <button
                  className="w-8 h-8 rounded bg-white border border-[#dcdfea] flex items-center justify-center text-[#5a5f78] disabled:opacity-40 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* SIDE DRAWER: Live Inspection Drawer for Selected Order */}
          {selectedOrder && (
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-white rounded-xl shadow-lg border border-[#dcdfea] overflow-hidden sticky top-20">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-white flex items-center justify-between border-b border-[#dcdfea]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#e2e5f5] flex items-center justify-center text-[#2d3b8a]">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.9375rem] font-bold text-[#1a1d2e] font-display">
                        Order {selectedOrder.orderNumber}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e2e5f5] text-[#2c3f8f] text-[0.72rem] font-bold">
                        {selectedOrder.statusLabel}
                      </span>
                    </div>
                    <span className="text-[0.72rem] text-[#5a5f78]">
                      {selectedOrder.createdAt} ({selectedOrder.timeAgo} ရောက်ရှိ)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectOrder(null)}
                  className="w-8 h-8 rounded-lg bg-[#eceef5] hover:bg-[#dde1ff] flex items-center justify-center text-[#5a5f78] transition-colors cursor-pointer"
                  type="button"
                  title="Close inspection"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Scrollable Drawer Content */}
              <div className="p-4 sm:p-5 flex flex-col gap-4 max-h-[calc(100vh-260px)] overflow-y-auto">
                {/* Payment Verification Section & Screenshot Preview */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.84375rem] font-bold text-[#1a1d2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#8d5c08]">verified</span>
                      ငွေလွှဲစလစ် စစ်ဆေးခြင်း
                    </span>
                    <span className="font-mono text-[0.75rem] text-[#2c3f8f] font-bold bg-[#e2e5f5] px-2 py-0.5 rounded">
                      {selectedOrder.paymentMethodLabel}
                    </span>
                  </div>

                  {/* Customer Uploaded Slip Preview Card */}
                  {selectedOrder.paymentSlipUrl ? (
                    <div className="relative rounded-xl overflow-hidden bg-[#eceef5] p-2 flex flex-col gap-1.5 border border-[#dcdfea] group">
                      <div
                        onClick={() =>
                          onOpenSlipZoom(
                            selectedOrder.paymentSlipUrl!,
                            `Order ${selectedOrder.orderNumber} - ${selectedOrder.customerName}`,
                            `${selectedOrder.totalAmount.toLocaleString()} Ks`
                          )
                        }
                        className="relative w-full h-44 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center cursor-zoom-in"
                      >
                        <img
                          src={selectedOrder.paymentSlipUrl}
                          alt="Customer Payment Receipt"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-[#132373]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-full bg-white text-[#132373] text-[0.78125rem] font-bold shadow-md flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                            ကြီးမားစွာကြည့်ရန်
                          </span>
                        </div>
                      </div>

                      {/* Slip Metadata */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="flex flex-col">
                          <span className="text-[0.72rem] text-[#5a5f78]">Transaction ID:</span>
                          <span className="font-mono text-[0.78125rem] text-[#1a1d2e] font-bold">
                            {selectedOrder.transactionId || '#TXN-88192031'}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[0.72rem] text-[#5a5f78]">လွှဲသည့်ငွေပမာဏ:</span>
                          <span className="font-mono text-[0.9375rem] text-[#2a7146] font-bold">
                            {selectedOrder.totalAmount.toLocaleString()} Ks
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-[#eceef5] text-center text-[#5a5f78] text-xs">
                      {selectedOrder.paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD) ပို့ဆောင်ချိန်တွင် ငွေချေမည်ဖြစ်ပါသည်'
                        : 'စလစ်တင်မထားသေးပါ (ငွေလွှဲစောင့်ဆိုင်းဆဲ)'}
                    </div>
                  )}
                </div>

                {/* Customer Demographics Card */}
                <div className="p-3.5 rounded-xl bg-[#eceef5] flex flex-col gap-1 border border-[#dcdfea]">
                  <span className="text-[0.7rem] text-[#5a5f78] uppercase tracking-wider font-bold">
                    ဝယ်ယူသူ အချက်အလက်
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#132373]/10 text-[#132373] flex items-center justify-center font-bold text-sm">
                        {selectedOrder.customerName.slice(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.84375rem] font-bold text-[#1a1d2e]">
                          {selectedOrder.customerName}
                        </span>
                        <span className="font-mono text-[0.75rem] text-[#5a5f78]">
                          {selectedOrder.customerPhone} (Viber ရှိ)
                        </span>
                      </div>
                    </div>

                    <a
                      href={`tel:${selectedOrder.customerPhone.replace(/\s+/g, '')}`}
                      className="w-8 h-8 rounded-lg bg-white text-[#132373] hover:bg-[#132373] hover:text-white flex items-center justify-center shadow-xs transition-colors border border-[#dcdfea]"
                      title="ဖုန်းခေါ်ရန်"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                  </div>

                  <div className="flex items-start gap-1.5 pt-2 mt-1 border-t border-[#dcdfea]/60">
                    <span className="material-symbols-outlined text-[16px] text-[#5a5f78] shrink-0 mt-0.5">
                      location_on
                    </span>
                    <span className="text-[0.78125rem] text-[#1a1d2e] leading-snug">
                      {selectedOrder.customerAddress}
                    </span>
                  </div>
                </div>

                {/* Itemised Cart Breakdown */}
                <div className="flex flex-col gap-2">
                  <span className="text-[0.7rem] text-[#5a5f78] uppercase tracking-wider font-bold">
                    မှာယူထားသော အထည်များ ({selectedOrder.items.length} ခု)
                  </span>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-[#eceef5] border border-[#dcdfea]"
                      >
                        <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0 shadow-xs border border-[#dcdfea]">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[0.84375rem] font-bold text-[#1a1d2e] truncate block">
                            {item.title}
                          </span>
                          <span className="font-mono text-[0.72rem] text-[#5a5f78]">
                            SKU: {item.sku} · အရေအတွက်: {item.qty}
                          </span>
                        </div>
                        <span className="font-mono text-[0.84375rem] font-bold text-[#1a1d2e] whitespace-nowrap">
                          {(item.price * item.qty).toLocaleString()} Ks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Calculation Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#eceef5] flex flex-col gap-1.5 text-[0.84375rem] border border-[#dcdfea]">
                  <div className="flex justify-between text-[#5a5f78]">
                    <span>ပစ္စည်းတန်ဖိုး စုစုပေါင်း:</span>
                    <span className="font-mono font-medium text-[#1a1d2e]">
                      {selectedOrder.subtotal.toLocaleString()} Ks
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5a5f78]">
                    <span>ရန်ကုန်မြို့တွင်း ပို့ဆောင်ခ (Delivery):</span>
                    <span className="font-mono font-medium text-[#1a1d2e]">
                      {selectedOrder.deliveryFee.toLocaleString()} Ks
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5a5f78]">
                    <span>လျှော့စျေး (Coupon Discount):</span>
                    <span className="font-mono text-[#2a7146] font-semibold">
                      -{selectedOrder.discount.toLocaleString()} Ks
                    </span>
                  </div>
                  <div className="flex justify-between text-[#1a1d2e] font-bold pt-2 mt-1 border-t border-[#dcdfea]">
                    <span className="text-[0.9375rem]">စုစုပေါင်း ကျသင့်ငွေ:</span>
                    <span className="font-mono text-[1.25rem] text-[#132373]">
                      {selectedOrder.totalAmount.toLocaleString()} Ks
                    </span>
                  </div>
                </div>

                {/* Internal Staff Note Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[0.7rem] text-[#5a5f78] uppercase font-bold">
                    အတွင်းမှတ်စု (Internal Staff Note)
                  </label>
                  <input
                    type="text"
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder="ဥပမာ - ဝယ်သူထံ ဖုန်းဆက် အတည်ပြုပြီး..."
                    className="w-full h-9 px-3 bg-[#eceef5] rounded-lg text-[0.84375rem] text-[#1a1d2e] focus:outline-none focus:bg-white border border-[#dcdfea] focus:border-[#132373] transition-all"
                  />
                </div>
              </div>

              {/* Sticky Drawer Bottom Action Footer */}
              <div className="p-4 sm:p-5 bg-white flex flex-col gap-2 border-t border-[#dcdfea] shadow-lg">
                {/* Primary Approval Button */}
                <button
                  onClick={handleConfirmOrder}
                  className="w-full py-2.5 rounded-lg bg-[#2a7146] text-white font-bold text-[0.84375rem] flex items-center justify-center gap-2 shadow-xs hover:bg-[#004d28] transition-all cursor-pointer active:scale-98"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  <span>ငွေဝင်ပြီ — Confirm & အတည်ပြုမည်</span>
                </button>

                {/* Rejection / Slip Issue Button */}
                <button
                  onClick={handleRejectOrder}
                  className="w-full py-2 rounded-lg bg-[#f9e1de] text-[#ad3229] font-bold text-[0.84375rem] flex items-center justify-center gap-1.5 hover:bg-[#ad3229] hover:text-white transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  <span>Reject (ငွေပမာဏ မကိုက် / စလစ် မရှင်း)</span>
                </button>

                {/* Passive Cancel Button */}
                <button
                  onClick={() => onSelectOrder(null)}
                  className="w-full py-1.5 rounded-lg text-[#5a5f78] hover:text-[#1a1d2e] text-[0.84375rem] text-center transition-colors cursor-pointer"
                  type="button"
                >
                  မလုပ်ဆောင်သေးဘဲ ခေတ္တပိတ်မည်
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Craft Studio Inventory Batch Status Note at bottom */}
        <div className="p-3.5 rounded-xl bg-[#eceef5] border border-[#dcdfea] flex flex-col sm:flex-row items-center justify-between gap-2.5 z-10">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#b4801f] text-[22px]">palette</span>
            <span className="text-[0.84375rem] text-[#1a1d2e]">
              ယခုတစ်ပတ် ရေဆေး ဖယောင်းထုတ်ပြီး အထည်လက်ကျန်:{' '}
              <span className="font-mono font-bold text-[#132373]">
                #SHS-2024-B8 (၃၄ ထည် အဆင်သင့်)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.75rem] text-[#5a5f78]">
              Delivery Partner: Royal Express & COD Yangon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
