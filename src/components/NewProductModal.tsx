import React, { useState } from 'react';
import { Product } from '../types';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onShowToast: (title: string, message: string) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState(`P0${Math.floor(10 + Math.random() * 89)}`);
  const [category, setCategory] = useState<'sarong' | 'blouse' | 'fabric' | 'accessories'>('sarong');
  const [price, setPrice] = useState(48000);
  const [cutDescription, setCutDescription] = useState('2-yard cut');
  const [stockCount, setStockCount] = useState(10);
  const [tag, setTag] = useState('ပစ္စည်းအသစ်');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim()) return;

    const newProd: Product = {
      sku,
      title,
      cutDescription,
      category,
      categoryLabel: category === 'sarong' ? 'ထဘီ (Sarong)' : category === 'blouse' ? 'အင်္ကျီ (Blouse)' : category === 'fabric' ? 'ပိတ်စ (Fabric)' : 'ဆက်စပ်ပစ္စည်း',
      price,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpX6BC4Vkuo8W09njTh-gpyCZjHD5qXzqWwMojxSaPfB8Z3AF4t4hGNeRdn64pasmKbGQ0r23MA9D7OC6zpk094P2vdysXoUJoDRw55SrMZsBUjT6q9xN7B8bMm5cAesAZZg1HfLIS21MmipCvx3ueoTkkoy8-BOlF3G1V0aCN4X8-fv9sN2vQFnc-qdhQ2tIE8Lkl5sG_B0oHmp0B3pgb0y3kx82vZA9AWOvfWt7XrGW_vbN9_iF26Q',
      badgeTag: 'HANDWAX',
      variantsSummary: '1 ရောင် × Free size',
      stockCount,
      stockUnit: category === 'sarong' ? 'စုံ' : category === 'blouse' ? 'ထည်' : category === 'fabric' ? 'လိပ်' : 'လုံး',
      tags: tag ? [tag] : [],
      status: 'Published',
      colorways: [
        {
          colorName: 'သဘာဝ ဆိုးဆေးရောင်',
          colorHex: '#2c3f8f',
          batchCode: '#NEW-ATELIER',
          sizes: { S: 2, M: 4, L: 4, XL: 0, Free: 0 },
        },
      ],
    };

    onAddProduct(newProd);
    onClose();
    onShowToast('ပစ္စည်းအသစ် ထည့်သွင်းပြီး', `"${title}" (${sku}) ကို ကတ်တလောက်တွင် ထည့်သွင်းပြီးပါပြီ။`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121528]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#dcdfea] max-w-lg w-full overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#eceef5] flex items-center justify-between border-b border-[#dcdfea]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#132373] text-[20px]">styler</span>
            <h3 className="font-bold text-sm text-[#1a1d2e] font-display">ပါတိတ်ပစ္စည်း အသစ်ထည့်သွင်းရန်</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#dde1ff] text-[#5a5f78] flex items-center justify-center transition-colors cursor-pointer border border-[#dcdfea]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">SKU ကုဒ် *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] font-mono text-sm text-[#1a1d2e]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">အမျိုးအစား</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] text-xs text-[#1a1d2e] cursor-pointer"
              >
                <option value="sarong">ထဘီ (Batik Sarongs)</option>
                <option value="blouse">အင်္ကျီ (Blouses/Shirts)</option>
                <option value="fabric">ပိတ်စ (Fabric Bolts)</option>
                <option value="accessories">ဆက်စပ်ပစ္စည်း (Accessories)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#5a5f78] font-bold block">ဒီဇိုင်းနှင့် ပစ္စည်းအမည် *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ဥပမာ - ပုဂံနရပတိ ဖယောင်းရိုက်ပိုးပါတိတ်"
              className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] text-sm text-[#1a1d2e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">ရောင်းဈေး (Ks) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] font-mono text-sm text-[#1a1d2e]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">စတင်လက်ကျန် (Stock Units)</label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] font-mono text-sm text-[#1a1d2e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">ဖြတ်တောက်မှု (Cut/Size)</label>
              <input
                type="text"
                value={cutDescription}
                onChange={(e) => setCutDescription(e.target.value)}
                placeholder="2-yard cut / Free size"
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] text-xs text-[#1a1d2e]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#5a5f78] font-bold block">တံဆိပ် (Tag)</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="ပစ္စည်းအသစ် / Special"
                className="w-full h-9 px-3 bg-[#eceef5] rounded-lg border border-[#dcdfea] text-xs text-[#1a1d2e]"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#dcdfea]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eceef5] hover:bg-[#dde1ff] text-[#1a1d2e] font-bold text-xs cursor-pointer"
            >
              မလုပ်တော့ပါ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              ပစ္စည်း အတည်ပြုထည့်သွင်းမည်
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
