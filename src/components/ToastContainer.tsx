import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => {
        const toneClasses =
          toast.tone === 'error'
            ? 'bg-rose-950 text-white border-rose-800'
            : toast.tone === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-slate-900 text-white border-orange-600/50';

        const Icon =
          toast.tone === 'error'
            ? AlertCircle
            : toast.tone === 'info'
              ? Info
              : CheckCircle2;

        return (
          <div
            key={toast.id}
            role="status"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm ${toneClasses}`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${
                toast.tone === 'error'
                  ? 'text-rose-400'
                  : toast.tone === 'info'
                    ? 'text-sky-400'
                    : 'text-orange-400'
              }`}
              aria-hidden="true"
            />
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
