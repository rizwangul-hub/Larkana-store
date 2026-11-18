import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Banknote, MessageCircle, PackageCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

export const AboutPage: React.FC = () => {
  const { settings, categories } = useStore();

  return (
    <div className="bg-white">
      <section className="bg-slate-50 border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-xs sm:text-sm font-semibold text-orange-600">
                About {settings.storeName}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                Everyday Essentials &amp; Curated Finds for {settings.deliveryCity}
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                {settings.storeName} is built around a simple idea: local shoppers in {settings.deliveryCity} deserve an easy, transparent online store where books, embroidered dresses, daily apparel, footwear, bags, and cosmetics are thoughtfully organized in one place.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Instead of complex payment barriers, every order is placed directly with Cash on Delivery and confirmed personally over WhatsApp ({settings.whatsappDisplay}).
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                  <span>Browse Store</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:border-orange-600 hover:text-orange-600 transition-colors"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Larkana Store curated retail showcase"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-xl p-6 space-y-2.5">
              <PackageCheck className="w-6 h-6 text-orange-600" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                {categories.length} Shopping Categories
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                From academic books and stitched dresses to footwear, backpacks, and skincare — all browsable from any mobile phone.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 space-y-2.5">
              <Truck className="w-6 h-6 text-orange-600" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Local Doorstep Delivery
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Focused home delivery coverage across {settings.deliveryCity} with clear Rs. {settings.deliveryCharge} delivery charges shown upfront.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6 space-y-2.5">
              <Banknote className="w-6 h-6 text-orange-600" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Cash on Delivery &amp; WhatsApp
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Order directly from the storefront and send your itemized order summary straight to WhatsApp for personal confirmation.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Client Demonstration Notice
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                This website is an interactive client demonstration showcasing customer shopping, WhatsApp COD checkout, and an admin management dashboard using browser LocalStorage.
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappInternational || '923221393770'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
