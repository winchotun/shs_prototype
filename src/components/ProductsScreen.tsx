import React, { useState, useMemo } from 'react';
import { Product, ColorwayStock } from '../types';

interface ProductsScreenProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onOpenNewProductModal: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  products,
  onUpdateProduct,
  onOpenNewProductModal,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [matrixProduct, setMatrixProduct] = useState<Product | null>(null);
  const [editingColorways, setEditingColorways] = useState<ColorwayStock[]>([]);
  const [bulkStockVal, setBulkStockVal] = useState<number>(5);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      sarong: products.filter((p) => p.category === 'sarong').length,
      blouse: products.filter((p) => p.category === 'blouse').length,
      fabric: products.filter((p) => p.category === 'fabric').length,
      accessories: products.filter((p) => p.category === 'accessories').length,
    };
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchEn = (p.englishTitle || '').toLowerCase().includes(q);
        if (!matchSku && !matchTitle && !matchEn) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Open Matrix Modal
  const openMatrixModal = (prod: Product) => {
    setMatrixProduct(prod);
    // Deep clone colorways
    setEditingColorways(JSON.parse(JSON.stringify(prod.colorways)));
  };

  const closeMatrixModal = () => {
    setMatrixProduct(null);
    setEditingColorways([]);
  };

  const handleCellChange = (
    colorIdx: number,
    sizeKey: 'S' | 'M' | 'L' | 'XL' | 'Free',
    val: number
  ) => {
    setEditingColorways((prev) => {
      const copy = [...prev];
      copy[colorIdx].sizes[sizeKey] = Math.max(0, val || 0);
      return copy;
    });
  };

  const applyBulkStock = () => {
    setEditingColorways((prev) => {
      return prev.map((cw) => ({
        ...cw,
        sizes: {
          S: bulkStockVal,
          M: bulkStockVal,
          L: bulkStockVal,
          XL: bulkStockVal,
          Free: bulkStockVal,
        },
      }));
    });
    onShowToast('Bulk Stock သတ်မှတ်ပြီး', `ကွက်လပ်အားလုံးတွင် ${bulkStockVal} ထည် သတ်မှတ်လိုက်ပါသည်။`);
  };

  // Matrix calculations
  const matrixStats = useMemo(() => {
    if (!editingColorways.length) return { rowTotals: [], colTotals: { S: 0, M: 0, L: 0, XL: 0, Free: 0 }, grandTotal: 0 };

    const colTotals = { S: 0, M: 0, L: 0, XL: 0, Free: 0 };
    const rowTotals = editingColorways.map((cw) => {
      const sum = cw.sizes.S + cw.sizes.M + cw.sizes.L + cw.sizes.XL + cw.sizes.Free;
      colTotals.S += cw.sizes.S;
      colTotals.M += cw.sizes.M;
      colTotals.L += cw.sizes.L;
      colTotals.XL += cw.sizes.XL;
      colTotals.Free += cw.sizes.Free;
      return sum;
    });
    const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

    return { rowTotals, colTotals, grandTotal };
  }, [editingColorways]);

  const saveMatrixStock = () => {
    if (!matrixProduct) return;
    const updated: Product = {
      ...matrixProduct,
      colorways: editingColorways,
      stockCount: matrixStats.grandTotal,
    };
    onUpdateProduct(updated);
    closeMatrixModal();
    onShowToast('Stock Matrix သိမ်းဆည်းပြီးပါပြီ', `${matrixProduct.title} ၏ အရောင်နှင့် ဆိုဒ် လက်ကျန် အသစ်များကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။`);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-4 sm:px-6 py-5 flex flex-col gap-5 max-w-[1440px] mx-auto w-full">
        {/* Header Summary Bento & Craft Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#dcdfea] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78] tracking-wider">
                စုစုပေါင်း ပစ္စည်း (Active SKUs)
              </span>
              <span className="material-symbols-outlined text-[#2c3f8f] text-[20px]">inventory_2</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[1.625rem] font-bold text-[#1a1d2e] font-mono">148</span>
              <span className="text-[0.75rem] text-[#2a7146] font-semibold">↑ 12 designs new</span>
            </div>
            <div className="mt-1 text-[0.75rem] text-[#5a5f78] font-mono">
              Wax-resist handcrafted catalogue
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#dcdfea] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78] tracking-wider">
                ပစ္စည်းလက်ကျန်နည်း (Low Stock)
              </span>
              <span className="material-symbols-outlined text-[#8d5c08] text-[20px]">warning_amber</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[1.625rem] font-bold text-[#8d5c08] font-mono">9</span>
              <span className="text-[0.7rem] bg-[#8d5c08] text-white px-2 py-0.5 rounded-full font-bold">
                Action needed
              </span>
            </div>
            <div className="mt-1 text-[0.75rem] text-[#5a5f78] font-mono">
              Less than 3 units remaining
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#dcdfea] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78] tracking-wider">
                ပစ္စည်းကုန်နေသည် (Out of Stock)
              </span>
              <span className="material-symbols-outlined text-[#ad3229] text-[20px]">block</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[1.625rem] font-bold text-[#ad3229] font-mono">3</span>
              <span className="text-[0.75rem] text-[#5a5f78]">Re-dip in atelier</span>
            </div>
            <div className="mt-1 text-[0.75rem] text-[#5a5f78] font-mono">Website shows: "ကုန်ပါပြီ"</div>
          </div>

          <div className="bg-[#132373] rounded-xl p-4 shadow-xs text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase font-bold text-[#dee0ff] tracking-wider">
                လက်လုပ် အဆင့်များ (Atelier Batches)
              </span>
              <span className="material-symbols-outlined text-[#fdbd64] text-[20px]">palette</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[1.625rem] font-bold text-white font-mono">24</span>
              <span className="text-[0.75rem] text-[#fdbd64] font-semibold">Natural Indigo & Madder</span>
            </div>
            <div className="mt-1 text-[0.75rem] text-[#dde1ff] font-mono">Batch #SHS-2024-B8 Active</div>
          </div>
        </div>

        {/* Live Customer Preview Banner */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#dcdfea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f5ead3] text-[#835500] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.875rem] font-bold text-[#1a1d2e]">Customer မျက်နှာပြင် ဖော်ပြမှု မူဝါဒ</span>
              <span className="text-[0.75rem] text-[#5a5f78]">
                Website နှင့် မိုဘိုင်းအက်ပ်တွင် လက်ကျန်အရေအတွက်အတိအကျ မပြပါ။ လက်ကျန် 1 ခုနှင့်အထက်ရှိပါက{' '}
                <strong className="text-[#2a7146] font-semibold">"ရနိုင်သည်" (Available)</strong>၊ သုညဖြစ်ပါက{' '}
                <strong className="text-[#ad3229] font-semibold">"ကုန်ပါပြီ" (Sold Out)</strong> အဖြစ်သာ အလိုအလျောက် သတ်မှတ်ပါသည်။
              </span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[0.72rem] px-2.5 py-1 rounded-full bg-[#eceef5] text-[#5a5f78] font-mono font-bold">
              Auto-sync Active
            </span>
          </div>
        </div>

        {/* Category Filter Chips & Search / Add Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Category Navigation Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'အားလုံး', count: categoryCounts.all },
                { id: 'sarong', label: 'ထဘီ (Batik Sarongs)', count: categoryCounts.sarong },
                { id: 'blouse', label: 'အင်္ကျီ (Blouses/Shirts)', count: categoryCounts.blouse },
                { id: 'fabric', label: 'ပိတ်စ (Fabric Bolts)', count: categoryCounts.fabric },
                { id: 'accessories', label: 'ဆက်စပ်ပစ္စည်း (Accessories)', count: categoryCounts.accessories },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[0.78125rem] font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#132373] text-white'
                        : 'bg-white hover:bg-[#eceef5] text-[#1a1d2e] border border-[#dcdfea]'
                    }`}
                    type="button"
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[0.7rem] font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#eceef5] text-[#5a5f78]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions & Search */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex-1 sm:w-72">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a5f78] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by SKU or Title..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-white text-[0.84375rem] text-[#1a1d2e] placeholder:text-[#5a5f78] border border-[#dcdfea] shadow-xs focus:outline-none focus:ring-1 focus:ring-[#132373] transition-all"
                />
              </div>

              <button
                onClick={onOpenNewProductModal}
                className="h-9 px-3.5 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white text-[0.78125rem] font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ ပစ္စည်းအသစ်</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-[#dcdfea] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eceef5] text-[#5a5f78] text-[0.72rem] tracking-wider uppercase font-semibold">
                  <th className="py-3 px-4 font-bold">ဒီဇိုင်းနှင့် ပစ္စည်းအမည် (Product)</th>
                  <th className="py-3 px-3 font-bold">အမျိုးအစား</th>
                  <th className="py-3 px-3 font-bold text-right">ဈေးနှုန်း (Price)</th>
                  <th className="py-3 px-3 font-bold text-center">Variants (အရောင် x ဆိုဒ်)</th>
                  <th className="py-3 px-3 font-bold text-right">စုစုပေါင်း လက်ကျန်</th>
                  <th className="py-3 px-3 font-bold text-center">တံဆိပ်များ (Tags)</th>
                  <th className="py-3 px-3 font-bold text-center">အခြေအနေ</th>
                  <th className="py-3 px-4 font-bold text-right">လုပ်ဆောင်ချက်</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef5] text-[0.84375rem] text-[#1a1d2e]">
                {filteredProducts.map((p) => {
                  return (
                    <tr
                      key={p.sku}
                      onClick={() => openMatrixModal(p)}
                      className="hover:bg-[#eceef5]/60 transition-colors group cursor-pointer"
                    >
                      {/* Product details & thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-[#eceef5] overflow-hidden shrink-0 shadow-xs relative border border-[#dcdfea] group-hover:scale-105 transition-transform">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            {p.badgeTag && (
                              <span className="absolute top-0 left-0 bg-[#132373]/90 text-white font-mono text-[8px] font-bold px-1 rounded-br">
                                {p.badgeTag}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[0.875rem] text-[#1a1d2e] group-hover:text-[#132373] transition-colors truncate">
                              {p.title}
                            </span>
                            <span className="font-mono text-[0.72rem] text-[#5a5f78]">
                              SKU: <strong className="text-[#1a1d2e] font-semibold">{p.sku}</strong> · {p.cutDescription}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="text-[0.84375rem] text-[#1a1d2e]">{p.categoryLabel}</span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        <div className="flex flex-col items-end">
                          <span className="text-[#1a1d2e] font-bold">{p.price.toLocaleString()} Ks</span>
                          {p.originalPrice && (
                            <span className="text-[#5a5f78] line-through text-[11px]">
                              {p.originalPrice.toLocaleString()} Ks
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Variants */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1">
                            {p.colorways.map((cw, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full shadow-xs border border-white"
                                style={{ backgroundColor: cw.colorHex }}
                                title={cw.colorName}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[11px] text-[#5a5f78]">{p.variantsSummary}</span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className={`font-mono font-bold ${
                              p.stockCount === 0
                                ? 'text-[#ad3229]'
                                : p.stockCount <= 3
                                ? 'text-[#8d5c08]'
                                : 'text-[#1a1d2e]'
                            }`}
                          >
                            {p.stockCount} {p.stockUnit}
                          </span>
                          <span
                            className={`text-[0.7rem] px-2 py-0.5 rounded-full font-bold ${
                              p.stockCount === 0
                                ? 'bg-[#f9e1de] text-[#ad3229]'
                                : p.stockCount <= 3
                                ? 'bg-[#faeed3] text-[#8d5c08]'
                                : 'bg-[#dff0e5] text-[#2a7146]'
                            }`}
                          >
                            {p.stockCount === 0
                              ? 'ကုန် (Sold Out)'
                              : p.stockCount <= 3
                              ? 'နည်း (Low)'
                              : 'ရနိုင်သည်'}
                          </span>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {p.tags.length > 0 ? (
                            p.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  t.includes('Sale')
                                    ? 'bg-[#ffdad6] text-[#ad3229]'
                                    : t.includes('လူကြိုက်များ')
                                    ? 'bg-[#faeed3] text-[#8d5c08]'
                                    : t.includes('ပစ္စည်းအသစ်')
                                    ? 'bg-[#e2e5f5] text-[#132373]'
                                    : 'bg-[#eceef5] text-[#1a1d2e]'
                                }`}
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#5a5f78] text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[0.72rem] font-bold ${
                            p.status === 'Published'
                              ? 'text-[#2a7146]'
                              : p.status === 'Restocking'
                              ? 'text-[#8d5c08]'
                              : 'text-[#5a5f78]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.status === 'Published'
                                ? 'bg-[#2a7146]'
                                : p.status === 'Restocking'
                                ? 'bg-[#8d5c08]'
                                : 'bg-[#767682]'
                            }`}
                          />
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openMatrixModal(p)}
                            className="w-8 h-8 rounded-lg hover:bg-[#eceef5] flex items-center justify-center text-[#5a5f78] hover:text-[#132373] transition-colors cursor-pointer"
                            title="Manage Stock Matrix"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                          </button>
                          <button
                            onClick={() =>
                              onShowToast('Product Details', `${p.title} (${p.sku}) အတွက် အသေးစိတ်အချက်အလက်များကို ဖွင့်လှစ်နေပါသည်။`)
                            }
                            className="w-8 h-8 rounded-lg hover:bg-[#eceef5] flex items-center justify-center text-[#5a5f78] hover:text-[#1a1d2e] transition-colors cursor-pointer"
                            title="More Options"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination & Table Metadata */}
          <div className="p-3.5 bg-[#eceef5] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#dcdfea]">
            <span className="text-[0.75rem] text-[#5a5f78]">
              Showing <strong className="text-[#1a1d2e] font-semibold">1 – {filteredProducts.length}</strong> of 148 artisanal inventory items
            </span>
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1 rounded-lg bg-white border border-[#dcdfea] text-[#5a5f78] text-[0.75rem] shadow-xs disabled:opacity-50 cursor-not-allowed"
                disabled
                type="button"
              >
                ရှေ့သို့ (Prev)
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-[#132373] text-white text-[0.75rem] font-bold flex items-center justify-center shadow-xs"
                type="button"
              >
                1
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#dcdfea] text-[#1a1d2e] hover:bg-[#eceef5] text-[0.75rem] font-medium flex items-center justify-center shadow-xs cursor-pointer"
                type="button"
              >
                2
              </button>
              <button
                className="w-8 h-8 rounded-lg bg-white border border-[#dcdfea] text-[#1a1d2e] hover:bg-[#eceef5] text-[0.75rem] font-medium flex items-center justify-center shadow-xs cursor-pointer"
                type="button"
              >
                3
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-white border border-[#dcdfea] text-[#1a1d2e] hover:bg-[#eceef5] text-[0.75rem] shadow-xs cursor-pointer"
                type="button"
              >
                နောက်သို့ (Next)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLOR x SIZE STOCK MATRIX INSPECTION DRAWER / MODAL */}
      {matrixProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-[#121528]/50 backdrop-blur-xs transition-opacity"
            onClick={closeMatrixModal}
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between border-l border-[#dcdfea]">
              {/* Header */}
              <div className="p-4 sm:p-5 bg-[#eceef5] flex items-start justify-between border-b border-[#dcdfea]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-[#132373] text-white font-mono text-[0.75rem] font-bold px-2 py-0.5 rounded">
                      {matrixProduct.sku}
                    </span>
                    <span className="text-[0.72rem] font-bold text-[#5a5f78] uppercase">
                      {matrixProduct.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[0.72rem] px-2 py-0.5 rounded-full bg-[#f5ead3] text-[#835500] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">water_drop</span> Atelier Dyed
                    </span>
                  </div>

                  <h2 className="text-[1.25rem] font-bold text-[#1a1d2e] font-display">
                    {matrixProduct.title}
                  </h2>

                  <div className="mt-1 flex items-center gap-3 text-[0.78125rem] font-mono text-[#5a5f78]">
                    <span>
                      အခြေခံဈေး: <strong className="text-[#1a1d2e]">{matrixProduct.price.toLocaleString()} Ks</strong>
                    </span>
                    <span>•</span>
                    <span className="text-[#2c3f8f] font-semibold">
                      အရောင် × ဆိုဒ် လက်ကျန်စနစ် (Color × Size Stock Matrix)
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeMatrixModal}
                  className="w-9 h-9 rounded-lg bg-white hover:bg-[#eceef5] flex items-center justify-center text-[#5a5f78] hover:text-[#1a1d2e] shadow-xs transition-colors cursor-pointer border border-[#dcdfea]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
                {/* Bulk Stock Setter Utility Well */}
                <div className="p-3.5 bg-[#eceef5] rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-[#dcdfea]">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#2c3f8f] text-[22px]">
                      auto_fix_high
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[0.84375rem] font-bold text-[#1a1d2e]">
                        တစ်ပြိုင်နက် သတ်မှတ်ရန် (Bulk Stock Setter)
                      </span>
                      <span className="text-[0.75rem] text-[#5a5f78]">
                        Matrix ကွက်လပ် အားလုံးတွင် အရေအတွက် အညီသတ်မှတ်ရန်
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={bulkStockVal}
                      onChange={(e) => setBulkStockVal(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 h-9 px-2 bg-white text-center font-mono text-[0.84375rem] rounded-lg border border-[#dcdfea] shadow-xs focus:outline-none focus:ring-1 focus:ring-[#132373]"
                    />
                    <button
                      onClick={applyBulkStock}
                      className="h-9 px-3 rounded-lg bg-white hover:bg-[#eceef5] text-[#1a1d2e] text-[0.78125rem] font-bold border border-[#dcdfea] shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                      type="button"
                    >
                      Apply to All
                    </button>
                  </div>
                </div>

                {/* Color x Size Matrix Grid */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.84375rem] font-bold text-[#1a1d2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#5a5f78]">grid_view</span>
                      လက်ကျန် စာရင်းဇယား (Stock Matrix Grid)
                    </span>
                    <span className="text-[0.75rem] text-[#5a5f78]">ယူနစ်: ထည်/စုံ (Units)</span>
                  </div>

                  {/* Table Matrix */}
                  <div className="rounded-xl overflow-hidden shadow-xs border border-[#dcdfea] bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#eceef5] text-[#5a5f78] text-[0.72rem] uppercase font-bold">
                          <th className="p-3">အရောင် (Colorway)</th>
                          <th className="p-2 text-center">S</th>
                          <th className="p-2 text-center">M</th>
                          <th className="p-2 text-center">L</th>
                          <th className="p-2 text-center">XL</th>
                          <th className="p-2 text-center">Free Size</th>
                          <th className="p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eceef5] text-[0.84375rem] text-[#1a1d2e]">
                        {editingColorways.map((cw, idx) => {
                          const rowSum = matrixStats.rowTotals[idx] || 0;
                          return (
                            <tr key={idx} className="hover:bg-[#eceef5]/40 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="w-4 h-4 rounded-full shadow-xs shrink-0 border border-black/10"
                                    style={{ backgroundColor: cw.colorHex }}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-[#1a1d2e]">{cw.colorName}</span>
                                    <span className="font-mono text-[10px] text-[#5a5f78]">
                                      Batch: {cw.batchCode}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {(['S', 'M', 'L', 'XL', 'Free'] as const).map((sizeKey) => {
                                const val = cw.sizes[sizeKey];
                                return (
                                  <td key={sizeKey} className="p-1.5 text-center">
                                    <input
                                      type="number"
                                      min={0}
                                      value={val}
                                      onChange={(e) =>
                                        handleCellChange(idx, sizeKey, parseInt(e.target.value) || 0)
                                      }
                                      className={`w-12 h-8 bg-[#eceef5] text-center font-mono text-[0.84375rem] rounded border focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#132373] ${
                                        val === 0
                                          ? 'text-[#ad3229] border-[#ffdad6]'
                                          : val <= 2
                                          ? 'text-[#8d5c08] border-[#faeed3]'
                                          : 'text-[#1a1d2e] border-[#dcdfea]'
                                      }`}
                                    />
                                  </td>
                                );
                              })}

                              <td
                                className={`p-3 text-right font-mono font-bold ${
                                  rowSum === 0 ? 'text-[#ad3229]' : 'text-[#1a1d2e]'
                                }`}
                              >
                                {rowSum}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#eceef5] font-bold text-[#1a1d2e] font-mono border-t border-[#dcdfea]">
                          <td className="p-3 text-[0.84375rem] font-sans">ဆိုဒ်အလိုက် ပေါင်းလဒ်</td>
                          <td className="p-2 text-center">{matrixStats.colTotals.S}</td>
                          <td className="p-2 text-center">{matrixStats.colTotals.M}</td>
                          <td className="p-2 text-center">{matrixStats.colTotals.L}</td>
                          <td className="p-2 text-center">{matrixStats.colTotals.XL}</td>
                          <td className="p-2 text-center">{matrixStats.colTotals.Free}</td>
                          <td className="p-3 text-right text-[#132373] text-[1.1rem]">
                            {matrixStats.grandTotal}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Customer Visibility Impact Preview */}
                <div className="p-3.5 rounded-xl bg-[#eceef5] flex flex-col gap-2 border border-[#dcdfea]">
                  <span className="text-[0.7rem] uppercase font-bold text-[#5a5f78]">
                    Customer အမြင် ဖော်ပြချက် (Storefront Live State)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[0.75rem]">
                    {editingColorways.map((cw, i) => {
                      const sum = matrixStats.rowTotals[i] || 0;
                      return (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-white shadow-xs border border-[#dcdfea] flex items-center justify-between"
                        >
                          <span className="font-semibold text-[#1a1d2e] truncate mr-1">
                            {cw.colorName.split(' ')[0]}
                          </span>
                          {sum > 0 ? (
                            <span className="text-[#2a7146] font-bold flex items-center gap-1 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2a7146]"></span> ရနိုင်သည်
                            </span>
                          ) : (
                            <span className="text-[#ad3229] font-bold flex items-center gap-1 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ad3229]"></span> ကုန်ပါပြီ
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Sticky Actions */}
              <div className="p-4 sm:p-5 bg-[#eceef5] flex items-center justify-between gap-3 border-t border-[#dcdfea]">
                <div className="flex items-center gap-1.5 text-[0.75rem] text-[#5a5f78]">
                  <span className="material-symbols-outlined text-[16px] text-[#2a7146]">lock</span>
                  <span>Atelier inventory updates sync instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeMatrixModal}
                    className="px-3.5 h-9 rounded-lg bg-white hover:bg-[#dde1ff] text-[#1a1d2e] text-[0.78125rem] font-bold shadow-xs transition-colors cursor-pointer border border-[#dcdfea]"
                    type="button"
                  >
                    မလုပ်တော့ပါ (Cancel)
                  </button>
                  <button
                    onClick={saveMatrixStock}
                    className="px-4 h-9 rounded-lg bg-[#132373] hover:bg-[#2d3b8a] text-white text-[0.78125rem] font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>သိမ်းဆည်းမည် (Save Changes)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
