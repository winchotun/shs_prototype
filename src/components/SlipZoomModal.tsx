import React from 'react';

interface SlipZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  amount: string;
  onVerify?: () => void;
}

export const SlipZoomModal: React.FC<SlipZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  amount,
  onVerify,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121528]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#dcdfea] max-w-lg w-full overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#eceef5] flex items-center justify-between border-b border-[#dcdfea]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8d5c08] text-[20px]">receipt_long</span>
            <div>
              <h3 className="font-bold text-sm text-[#1a1d2e]">{title}</h3>
              <span className="text-xs text-[#5a5f78]">လွှဲသည့်ငွေ: {amount}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#dde1ff] text-[#5a5f78] flex items-center justify-center transition-colors cursor-pointer border border-[#dcdfea]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Image Container with high detail */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900 flex items-center justify-center min-h-[360px]">
          <img
            src={imageUrl}
            alt="Payment Slip Full Details"
            className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg border border-white/10"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white flex items-center justify-between gap-3 border-t border-[#dcdfea]">
          <span className="text-xs text-[#5a5f78] flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#2a7146]">verified</span>
            Transaction Slip Ready
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#eceef5] hover:bg-[#dde1ff] text-[#1a1d2e] text-xs font-bold transition-colors cursor-pointer"
            >
              ပိတ်မည်
            </button>
            {onVerify && (
              <button
                onClick={() => {
                  onVerify();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#2a7146] hover:bg-[#004d28] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                ငွေဝင်အတည်ပြုမည်
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
