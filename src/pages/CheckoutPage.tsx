import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { CheckoutFormInput, Order } from '../types';
import {
  type CheckoutValidationErrors,
  formatDeliveryAddress,
  formatPKR,
  validateCheckoutForm,
} from '../utils/storeLogic';
import { SafeImage } from '../components/SafeImage';

export const CheckoutPage: React.FC = () => {
  const { cartTotals, settings, placeCodOrder, notify } = useStore();

  const [form, setForm] = useState<CheckoutFormInput>({
    fullName: '',
    mobile: '',
    whatsapp: '',
    city: settings.deliveryCity || 'Larkana',
    address: '',
    instructions: '',
  });

  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleFieldChange = (field: keyof CheckoutFormInput, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'mobile' && sameAsMobile) {
        updated.whatsapp = value;
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, whatsapp: prev.mobile }));
      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      notify('Please complete all required delivery details.', 'error');
      return;
    }

    const order = placeCodOrder(form);
    setCompletedOrder(order);
    window.scrollTo(0, 0);

    // Trigger WhatsApp handoff in a new tab via anchor click without relying on window.open
    const link = document.createElement('a');
    link.href = order.whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const copyMessage = async () => {
    if (!completedOrder) return;
    try {
      await navigator.clipboard.writeText(completedOrder.whatsappMessage);
      notify('Order message copied to clipboard.');
    } catch {
      notify('Copy unavailable in this browser; please tap Open WhatsApp below.', 'info');
    }
  };

  // Post-Checkout Next Step Screen
  if (completedOrder) {
    return (
      <div className="bg-slate-50 min-h-[75vh] py-10 sm:py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Order Reference Saved · Pending Confirmation
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Reference #{completedOrder.id}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Your demo order has been recorded locally. Opening WhatsApp does not automatically confirm your order — please send the pre-filled WhatsApp message below so {settings.storeName} can confirm your Cash on Delivery dispatch.
              </p>
            </div>
          </div>

          {/* Primary WhatsApp Action */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-sm font-bold text-slate-900">
                Next Step: Send Order via WhatsApp
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                WhatsApp: {settings.whatsappDisplay} ({settings.whatsappInternational})
              </p>
            </div>
            <a
              href={completedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-order-link"
              className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Send Order on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Summary Box */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Customer</p>
                <p className="font-semibold text-slate-900">{completedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Mobile / WhatsApp</p>
                <p className="font-semibold text-slate-900 tabular-nums">
                  {completedOrder.mobile} · {completedOrder.whatsapp}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500">Delivery Address</p>
                <p className="font-medium text-slate-800">
                  {formatDeliveryAddress(completedOrder.address, completedOrder.city)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-sm tabular-nums">
              {completedOrder.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-slate-700">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatPKR(item.lineTotal)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                <span>Subtotal</span>
                <span>{formatPKR(completedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery ({completedOrder.city})</span>
                <span>{formatPKR(completedOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                <span>Total (Cash on Delivery)</span>
                <span className="text-orange-600">{formatPKR(completedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                WhatsApp Message Preview
              </span>
              <button
                type="button"
                onClick={copyMessage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Text</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {completedOrder.whatsappMessage}
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue Shopping
            </Link>
            <Link
              to="/admin"
              className="text-xs font-semibold text-slate-500 hover:text-orange-600"
            >
              View Order in Admin Demo →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartTotals.lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="text-sm text-slate-600">
          Add at least one item to your shopping cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[75vh] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-600 mb-3"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Checkout — Cash on Delivery
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Home delivery is currently demonstrated for <strong>{settings.deliveryCity}</strong>.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left: Delivery Details Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Customer &amp; Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-fullName"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Customer Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="e.g. Ahsan Ali Bhutto"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 focus:outline-none ${
                    errors.fullName
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-slate-300 focus:border-orange-600'
                  }`}
                />
                {errors.fullName && (
                  <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-mobile"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-mobile"
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  placeholder="03001234567"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 tabular-nums focus:outline-none ${
                    errors.mobile
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-slate-300 focus:border-orange-600'
                  }`}
                />
                {errors.mobile && (
                  <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="checkout-whatsapp"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                      className="accent-orange-600 cursor-pointer"
                    />
                    <span>Same as mobile</span>
                  </label>
                </div>
                <input
                  id="checkout-whatsapp"
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                  placeholder="03221393770"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 tabular-nums focus:outline-none ${
                    errors.whatsapp
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-slate-300 focus:border-orange-600'
                  }`}
                />
                {errors.whatsapp && (
                  <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-city"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Delivery City <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 focus:outline-none ${
                    errors.city
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-slate-300 focus:border-orange-600'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>Home delivery is currently demonstrated for {settings.deliveryCity}.</span>
                </p>
                {errors.city && (
                  <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-address"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Complete Delivery Address <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  required
                  value={form.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="House / Flat No., Street, Mohalla / Colony, Nearby Landmark in Larkana"
                  className={`w-full p-3.5 rounded-lg border text-sm text-slate-900 focus:outline-none ${
                    errors.address
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-slate-300 focus:border-orange-600'
                  }`}
                />
                {errors.address && (
                  <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-instructions"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Additional Order Instructions (Optional)
                </label>
                <input
                  id="checkout-instructions"
                  type="text"
                  value={form.instructions}
                  onChange={(e) => handleFieldChange('instructions', e.target.value)}
                  placeholder="e.g. Call before arriving, preferred delivery time"
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            {/* Payment Method (COD Only) */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-display text-sm font-bold text-slate-900 mb-3">
                Payment Method
              </h3>
              <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-orange-600 bg-orange-50/50">
                <Banknote className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pay in cash directly to our rider when your parcel is delivered in {settings.deliveryCity}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Your Order ({cartTotals.totalItems} items)
            </h2>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cartTotals.lines.map((line) => (
                <div key={line.productId} className="py-3 flex items-center gap-3">
                  <div className="w-14 aspect-[4/3] rounded-md overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <SafeImage
                      src={line.image}
                      alt={line.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {line.productName}
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums">
                      Qty {line.quantity} × {formatPKR(line.unitPrice)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                    {formatPKR(line.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2.5 text-sm tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatPKR(cartTotals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges ({settings.deliveryCity})</span>
                <span className="font-semibold text-slate-900">
                  {formatPKR(cartTotals.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-xl text-orange-600">
                  {formatPKR(cartTotals.grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3.5 rounded-xl bg-orange-600 text-white font-semibold text-base hover:bg-orange-700 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Place Order on WhatsApp</span>
            </button>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Clicking this button records your demo order reference and prepares a formatted WhatsApp message for {settings.whatsappDisplay}.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
};
