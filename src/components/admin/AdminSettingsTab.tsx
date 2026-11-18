import React, { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { normalizeWhatsAppNumber } from '../../utils/storeLogic';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay);
  const [deliveryCharge, setDeliveryCharge] = useState(String(settings.deliveryCharge));
  const [deliveryCity, setDeliveryCity] = useState(settings.deliveryCity);
  const [storeDescription, setStoreDescription] = useState(settings.storeDescription);
  const [announcementMessage, setAnnouncementMessage] = useState(
    settings.announcementMessage,
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFee = Number(deliveryCharge);
    updateSettings({
      storeName: storeName.trim() || 'Larkana Store',
      whatsappDisplay: whatsappDisplay.trim() || '03221393770',
      whatsappInternational: normalizeWhatsAppNumber(whatsappDisplay),
      deliveryCharge: Number.isFinite(parsedFee) && parsedFee >= 0 ? Math.round(parsedFee) : 150,
      deliveryCity: deliveryCity.trim() || 'Larkana',
      storeDescription: storeDescription.trim(),
      announcementMessage: announcementMessage.trim(),
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          Store Settings (Persisted in LocalStorage)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Updates immediately apply to the storefront announcement bar, checkout delivery fee, and WhatsApp order links.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="set-storeName" className="block text-xs font-semibold text-slate-700 mb-1">
              Store Name
            </label>
            <input
              id="set-storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="set-whatsapp" className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Number (Local Format)
            </label>
            <input
              id="set-whatsapp"
              type="text"
              value={whatsappDisplay}
              onChange={(e) => setWhatsappDisplay(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums"
            />
            <p className="text-[11px] text-slate-400 mt-1 tabular-nums">
              International wa.me format: {normalizeWhatsAppNumber(whatsappDisplay)}
            </p>
          </div>

          <div>
            <label htmlFor="set-deliveryCharge" className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Charges (PKR)
            </label>
            <input
              id="set-deliveryCharge"
              type="number"
              min="0"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="set-deliveryCity" className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery City
            </label>
            <input
              id="set-deliveryCity"
              type="text"
              value={deliveryCity}
              onChange={(e) => setDeliveryCity(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="set-announcement" className="block text-xs font-semibold text-slate-700 mb-1">
            Top Announcement Bar Message
          </label>
          <input
            id="set-announcement"
            type="text"
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="set-description" className="block text-xs font-semibold text-slate-700 mb-1">
            Store Description
          </label>
          <textarea
            id="set-description"
            rows={3}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 cursor-pointer"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Reset Demo Data */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-bold text-slate-900">
            Restore Initial Demo Data
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Resets products, categories, sample orders, and store settings back to the original demo defaults.
          </p>
        </div>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
