import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Truck, Banknote } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();
  const waHref = `https://wa.me/${settings.whatsappInternational || '923221393770'}`;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Short Business Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo variant="light" storeName={settings.storeName} />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.storeDescription}
            </p>
            <p className="text-xs text-slate-400">
              Client Demo Storefront · Sample Inventory &amp; Demo Pricing in PKR
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-400 transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-orange-400 transition-colors">
                  Admin Panel (Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Product Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.id)}`}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Delivery Information */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">
              Order &amp; Delivery Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-white font-medium">Home Delivery in {settings.deliveryCity}</p>
                  <p className="text-xs text-slate-400">
                    Standard fee: Rs. {settings.deliveryCharge} (Demo)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Banknote className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-white font-medium">Cash on Delivery (COD)</p>
                  <p className="text-xs text-slate-400">Pay conveniently at your doorstep</p>
                </div>
              </div>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp: {settings.whatsappDisplay}</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
          <p>
            Delivery Area: {settings.deliveryCity}, Pakistan · WhatsApp Orders: {settings.whatsappDisplay}
          </p>
        </div>
      </div>
    </footer>
  );
};
