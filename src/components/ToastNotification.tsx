import React, { useEffect } from 'react';

interface ToastNotificationProps {
  toast: { title: string; message: string } | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#132373] text-white px-5 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/20 max-w-md">
      <div className="w-8 h-8 rounded-full bg-[#2a7146] flex items-center justify-center text-white shrink-0 shadow-xs">
        <span className="material-symbols-outlined text-[18px]">check</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm truncate">{toast.title}</h4>
        <p className="text-xs text-[#dee0ff] mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-[#dee0ff] hover:text-white p-1 text-xs cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
