import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Phone, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, notify } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const waHref = `https://wa.me/${settings.whatsappInternational || '923221393770'}?text=${encodeURIComponent(
    `Assalam o Alaikum ${settings.storeName}! I have a question about a product.`,
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      nextErrors.phone = 'Please enter a valid mobile/WhatsApp number.';
    }
    if (!message.trim() || message.trim().length < 8) {
      nextErrors.message = 'Please write a short message (at least 8 characters).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
    notify('Demo inquiry submitted. For fastest help, message us on WhatsApp.');
  };

  return (
    <div className="bg-slate-50 min-h-[75vh] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-semibold text-orange-600">
            Get in Touch
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact {settings.storeName}
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Have a question about sizing, book availability, or Cash on Delivery in {settings.deliveryCity}? Reach out directly on WhatsApp or use the demo inquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {settings.storeName}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Online Storefront &amp; Doorstep Cash on Delivery
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">WhatsApp Orders &amp; Support</p>
                  <p className="font-semibold text-slate-900 tabular-nums">
                    {settings.whatsappDisplay}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Home Delivery Coverage</p>
                  <p className="font-semibold text-slate-900">
                    {settings.deliveryCity}, Pakistan
                  </p>
                </div>
              </div>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Contact on WhatsApp ({settings.whatsappDisplay})</span>
            </a>
          </div>

          {/* Demo Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Demo Message Recorded
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. Because this is a frontend client demonstration, this form does not send emails — please use the WhatsApp button to message {settings.storeName} directly.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Open WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Send a Quick Message (Frontend Demo)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Validates your inquiry locally in the demo interface.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                  {errors.name && (
                    <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Mobile / WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 tabular-nums focus:outline-none focus:border-orange-600"
                  />
                  {errors.phone && (
                    <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about product details, delivery timing in Larkana, or bulk orders..."
                    className="w-full p-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                  {errors.message && (
                    <p role="alert" className="text-xs text-rose-600 mt-1 font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Submit Demo Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
