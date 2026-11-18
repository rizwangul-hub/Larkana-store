import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const { settings, categories, cartTotals, isAdminAuthenticated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
      isActive
        ? 'text-orange-600 border-orange-600'
        : 'text-slate-700 border-transparent hover:text-orange-600 hover:border-orange-200'
    }`;

  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      {/* Slim Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center">
        <p className="max-w-7xl mx-auto truncate font-medium tracking-wide">
          {settings.announcementMessage}
        </p>
      </div>

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Left: Mobile Menu + Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-1 rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-600 cursor-pointer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          <Link
            to="/"
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 rounded"
          >
            <BrandLogo storeName={settings.storeName} />
          </Link>
        </div>

        {/* Center: Primary Navigation (Desktop) */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7"
        >
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setCatDropdownOpen(true)}
            onMouseLeave={() => setCatDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCatDropdownOpen((v) => !v)}
              aria-expanded={catDropdownOpen}
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-orange-600 whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {catDropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-56 z-50">
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                  <Link
                    to="/shop"
                    onClick={() => setCatDropdownOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                  >
                    All Categories
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.id)}`}
                      onClick={() => setCatDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </nav>

        {/* Right: Search, Account (Admin Demo), Shopping Cart */}
        <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search products"
            aria-expanded={searchOpen}
            className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          <Link
            to={isAdminAuthenticated ? '/admin' : '/admin/login'}
            aria-label={isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Account Login'}
            title="Admin Demo Portal"
            className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <User className="w-5 h-5" aria-hidden="true" />
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping Cart with ${cartTotals.totalItems} items`}
            className="relative inline-flex items-center gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-[42px] px-2.5 sm:px-3.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              data-testid="cart-badge-count"
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-white text-orange-700 text-xs font-bold tabular-nums"
            >
              {cartTotals.totalItems}
            </span>
          </Link>
        </div>
      </header>

      {/* Expandable Inline Search Bar */}
      {searchOpen && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <label htmlFor="header-search-input" className="sr-only">
              Search Larkana Store products
            </label>
            <input
              id="header-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, embroidered dresses, sneakers, bags, cosmetics..."
              autoFocus
              className="flex-1 h-11 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-600"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <BrandLogo storeName={settings.storeName} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-100">
              <div className="flex gap-2">
                <label htmlFor="mobile-search-input" className="sr-only">
                  Search products
                </label>
                <input
                  id="mobile-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 h-11 px-3 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="h-11 px-4 rounded-lg bg-orange-600 text-white text-sm font-semibold cursor-pointer"
                >
                  Go
                </button>
              </div>
            </form>

            <nav className="flex-1 px-4 py-4 space-y-1">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop All Products', to: '/shop' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Shopping Cart', to: '/cart' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[44px] px-3 rounded-lg text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${encodeURIComponent(cat.id)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center min-h-[42px] px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                to={isAdminAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-100"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login (Demo)'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
