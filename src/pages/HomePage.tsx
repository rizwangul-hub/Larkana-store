import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BadgePercent,
  Banknote,
  Truck,
  MessageSquareQuote,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE, PROMO_IMAGE } from '../data/seedData';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';

const DEMO_TESTIMONIALS = [
  {
    id: 'demo-t1',
    name: 'Sadia Khuhro',
    area: 'Sachal Colony, Larkana',
    category: 'Dresses & Cosmetics',
    quote:
      'Ordered an embroidered lawn suit and matte lipstick set through WhatsApp COD. Checking the total beforehand made ordering effortless.',
  },
  {
    id: 'demo-t2',
    name: 'Zeeshan Tunio',
    area: 'Chandka Area, Larkana',
    category: 'Books & Bags',
    quote:
      'Having academic study bundles and a sturdy campus backpack in one local store saved me multiple trips across the market.',
  },
  {
    id: 'demo-t3',
    name: 'Farah Abbasi',
    area: 'Station Road, Larkana',
    category: 'Shoes & Handbags',
    quote:
      'Clear PKR pricing with Cash on Delivery right at our doorstep in Larkana makes online shopping simple for the whole family.',
  },
];

export const HomePage: React.FC = () => {
  const { products, categories, settings } = useStore();

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-xs sm:text-sm font-semibold text-orange-600 tracking-wide">
                Home Delivery in {settings.deliveryCity} · Cash on Delivery
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
                Welcome to {settings.storeName}
              </h1>

              <p className="font-display text-lg sm:text-xl font-semibold text-slate-800">
                Everything You Love, All in One Place!
              </p>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Discover quality products at affordable prices. Shop online and
                get your orders delivered to your doorstep.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold text-sm sm:text-base hover:bg-orange-700 transition-colors whitespace-nowrap shadow-sm"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <a
                  href="#categories"
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-sm sm:text-base hover:border-orange-600 hover:text-orange-600 transition-colors whitespace-nowrap"
                >
                  Explore Categories
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <SafeImage
                  src={HERO_IMAGE}
                  alt="Curated collection from Larkana Store including embroidered dress, books, leather handbag, sneakers, and skincare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Categories */}
      <section id="categories" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Shop By Categories
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5">
                Browse six curated departments tailored for everyday life in {settings.deliveryCity}.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.id)}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <SafeImage
                    src={cat.image}
                    alt={`${cat.name} category`}
                    fallbackLabel={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-600">
                    <span>Explore</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5">
                Handpicked favorites ready for Cash on Delivery across {settings.deliveryCity}.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap"
            >
              <span>Browse All {products.length} Items</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayFeatured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryNameById.get(product.categoryId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-4 bg-slate-900 text-white">
                <p className="text-xs sm:text-sm font-semibold text-orange-400">
                  Larkana Store Collection
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance">
                  Shop More, Enjoy More!
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                  Discover amazing products and affordable prices at {settings.storeName}.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <span>Explore Full Store</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6 min-h-[240px] sm:min-h-[300px]">
                <SafeImage
                  src={PROMO_IMAGE}
                  alt="Larkana Store curated shelves displaying apparel, bags, footwear, and skincare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Choose {settings.storeName}?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              Built for convenient, dependable local shopping without hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Award,
                title: 'Quality Products',
                desc: 'Carefully selected books, apparel, footwear, bags, and cosmetics inspected before dispatch.',
              },
              {
                icon: BadgePercent,
                title: 'Affordable Prices',
                desc: 'Honest PKR pricing with transparent seasonal markdowns clearly displayed.',
              },
              {
                icon: Banknote,
                title: 'Cash on Delivery',
                desc: 'Pay in cash when your parcel arrives — no bank cards or online prepayment needed.',
              },
              {
                icon: Truck,
                title: `Home Delivery in ${settings.deliveryCity}`,
                desc: `Fast neighborhood doorstep delivery across ${settings.deliveryCity} for a flat Rs. ${settings.deliveryCharge} fee.`,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Sample Demo Testimonials */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Customer Testimonials (Sample Demo)
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Illustrative sample quotes demonstrating how customer feedback appears in the live store — not verified buyer reviews.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEMO_TESTIMONIALS.map((item) => (
              <figure
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-orange-700">Sample Demo Quote</span>
                    <MessageSquareQuote className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <blockquote className="text-sm text-slate-700 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="pt-3 border-t border-slate-200/80">
                  <p className="font-display text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.area} · {item.category}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
