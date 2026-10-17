import React, { useState } from 'react';
import { Order, Product } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddOrder: (order: Order) => void;
  onShowToast: (title: string, message: string) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddOrder,
  onShowToast,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [channel, setChannel] = useState<'phone' | 'viber' | 'messenger'>('phone');
  const [selectedProductSku, setSelectedProductSku] = useState(products[0]?.sku || 'P001');
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'kpay_slip' | 'wavepay_slip' | 'cod'>('kpay_slip');
  const [deliveryFee, setDeliveryFee] = useState(3000);

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.sku === selectedProductSku) || products[0];
  const itemTotal = (currentProd?.price || 48000) * qty;
  const grandTotal = itemTotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('ဝယ်ယူသူ အမည်နှင့် ဖုန်းနံပါတ် ဖြည့်သွင်းပေးပါ');
      return;
    }

    const orderNum = `#${Math.floor(1034 + Math.random() * 50)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      customerPhone,
      customerAddress: customerAddress || 'ရန်ကုန်မြို့တွင်း ပို့ဆောင်ရန်',
      channel,
      channelLabel: channel === 'phone' ? 'ဖုန်း Order' : channel === 'viber' ? 'Viber Order' : 'Messenger Order',
      items: [
        {
          title: currentProd.title,
          sku: currentProd.sku,
          qty,
          price: currentProd.price,
          image: currentProd.image,
        },
      ],
      subtotal: itemTotal,
      deliveryFee,
      discount: 0,
      totalAmount: grandTotal,
      paymentMethod,
      paymentMethodLabel: paymentMethod === 'kpay_slip' ? 'KBZPay' : paymentMethod === 'wavepay_slip' ? 'WavePay' : 'COD',
      status: paymentMethod === 'cod' ? 'packing' : 'review',
      statusLabel: paymentMethod === 'cod' ? 'ထုပ်ပိုးနေ' : 'စစ်ဆေးရန်',
      timeAgo: 'အခုလေးတင်',
      createdAt: 'ယနေ့ 11:58 AM',
      internalNote: 'လက်စွဲ ဖုန်းအော်ဒါ ထည့်သွင်းထားသည်။',
    };

    onAddOrder(newOrder);
    onClose();
    onShowToast('Order အသစ်ထည့်ပြီးပါပြီ', `${customerName} အတွက် ${orderNum} (စုစုပေါင်း ${grandTotal.toLocaleString()} Ks) စာရင်းသွင်းပြီးပါပြီ။`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121528]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#dcdfea] max-w-lg w-full overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#eceef5] flex items-center justify-between border-b border-[#dcdfea]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#132373] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1a1d2e] font-display">ဖုန်း / လူကိုယ်တိုင် Order အသစ်ထည့်</h3>
              <span className="text-xs text-[#5a5f78]">Shwe Hnin Si Atelier Assisted Order Entry</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#dde1ff] text-[#5a5f78] flex items-center justify-center transition-colors cursor-pointer border border-[#dcdfea]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">ဝယ်သူအမည် *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ဥပမာ - ဒေါ်လှလှမြင့်"
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white focus:border-[#132373] focus:outline-none text-sm text-[#1a1d2e]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">ဖုန်းနံပါတ် *</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="09 1234 5678"
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white focus:border-[#132373] focus:outline-none font-mono text-sm text-[#1a1d2e]"
              />
            </div>
          </div>

          {/* Channel & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">ချန်နယ် (Channel)</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white text-xs text-[#1a1d2e] cursor-pointer"
              >
                <option value="phone">ဖုန်းခေါ်ဆိုမှု (Phone Call)</option>
                <option value="viber">Viber Chat</option>
                <option value="messenger">Facebook Messenger</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">ငွေပေးချေမှု နည်းလမ်း</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white text-xs text-[#1a1d2e] cursor-pointer"
              >
                <option value="kpay_slip">KBZPay / KPay QR</option>
                <option value="wavepay_slip">WavePay QR / Transfer</option>
                <option value="cod">Cash on Delivery (အိမ်ရောက်ငွေချေ)</option>
              </select>
            </div>
          </div>

          {/* Product Select & Quantity */}
          <div className="space-y-1">
            <label className="text-[#5a5f78] uppercase font-bold block">ပါတိတ် အထည်ရွေးချယ်ရန်</label>
            <select
              value={selectedProductSku}
              onChange={(e) => setSelectedProductSku(e.target.value)}
              className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white text-xs text-[#1a1d2e] cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.title} ({p.sku}) - {p.price.toLocaleString()} Ks [ကျန်: {p.stockCount}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">အရေအတွက် (ထည်)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] font-mono text-sm text-[#1a1d2e]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#5a5f78] uppercase font-bold block">ပို့ခ (Delivery Fee)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] font-mono text-sm text-[#1a1d2e]"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-1">
            <label className="text-[#5a5f78] uppercase font-bold block">ပို့ဆောင်ရမည့် လိပ်စာ / ဂိတ်</label>
            <textarea
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="အမှတ်၊ လမ်း၊ မြို့နယ် သို့မဟုတ် ကားဂိတ်အမည်..."
              className="w-full p-2.5 bg-[#eceef5] rounded-lg border border-[#dcdfea] focus:bg-white focus:border-[#132373] text-xs text-[#1a1d2e]"
            />
          </div>

          {/* Pricing summary */}
          <div className="p-3 bg-[#eceef5] rounded-xl space-y-1 text-xs border border-[#dcdfea]">
            <div className="flex justify-between text-[#5a5f78]">
              <span>ပစ္စည်းကျသင့်ငွေ:</span>
              <span className="font-mono text-[#1a1d2e] font-semibold">{itemTotal.toLocaleString()} Ks</span>
            </div>
            <div className="flex justify-between text-[#5a5f78]">
              <span>ပို့ဆောင်ခ:</span>
              <span className="font-mono text-[#1a1d2e]">{deliveryFee.toLocaleString()} Ks</span>
            </div>
            <div className="pt-2 flex justify-between font-bold text-sm text-[#132373] border-t border-[#dcdfea]">
              <span>စုစုပေါင်း ကျသင့်ငွေ:</span>
              <span className="font-mono text-base">{grandTotal.toLocaleString()} Ks</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#dcdfea]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eceef5] hover:bg-[#dde1ff] text-[#1a1d2e] font-bold text-xs transition-colors cursor-pointer"
            >
              မလုပ်တော့ပါ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              အော်ဒါ အတည်ပြုထည့်သွင်းမည်
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
