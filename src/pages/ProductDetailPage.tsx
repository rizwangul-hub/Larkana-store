import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, getDiscountPercent, getEffectivePrice } from '../utils/storeLogic';
import { SafeImage } from '../components/SafeImage';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, settings, addToCart } = useStore();

  const product = products.find((p) => p.id === id);
  const category = product
    ? categories.find((c) => c.id === product.categoryId)
    : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Product Not Found
        </h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          This product may have been removed or updated in the catalog.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(product);
  const discountPct = getDiscountPercent(product);
  const isInStock = product.available && product.stock > 0;
  const galleryImages =
    product.images.length > 0 ? product.images : [''];
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const handleBuyNow = () => {
    if (!isInStock) return;
    addToCart(product.id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-orange-600">
            Shop
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                to={`/shop?category=${encodeURIComponent(category.id)}`}
                className="hover:text-orange-600"
              >
                {category.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              <SafeImage
                src={activeImage}
                alt={product.name}
                fallbackLabel={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View product image ${idx + 1}`}
                    className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-orange-600'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span>{category?.name || 'General'}</span>
              <span aria-hidden="true">·</span>
              <span className={isInStock ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                {isInStock ? `In Stock (${product.stock} available)` : 'Currently Out of Stock'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 tabular-nums">
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatPKR(effectivePrice)}
              </span>
              {discountPct > 0 && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatPKR(product.price)}
                  </span>
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Quantity
              </span>
              <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!isInStock || quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-11 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span
                  data-testid="pdp-quantity"
                  className="w-12 text-center font-semibold text-sm text-slate-900 tabular-nums"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(1, product.stock), q + 1))
                  }
                  disabled={!isInStock || quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="w-11 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={!isInStock}
                onClick={() => addToCart(product.id, quantity)}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-500 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                disabled={!isInStock}
                onClick={handleBuyNow}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 text-orange-400" aria-hidden="true" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Delivery Terms */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-orange-600 shrink-0" aria-hidden="true" />
                <span>
                  Home delivery available in {settings.deliveryCity} (Rs. {settings.deliveryCharge} fee)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Banknote className="w-4 h-4 text-orange-600 shrink-0" aria-hidden="true" />
                <span>Cash on Delivery (COD) · Order confirmation via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              More in {category?.name || 'This Category'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  categoryName={category?.name}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
