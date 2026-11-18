import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPKR, getDiscountPercent, getEffectivePrice } from '../utils/storeLogic';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const { addToCart } = useStore();
  const effectivePrice = getEffectivePrice(product);
  const discountPct = getDiscountPercent(product);
  const isInStock = product.available && product.stock > 0;

  return (
    <article className="group flex flex-col bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-50"
        aria-label={`View details for ${product.name}`}
      >
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fallbackLabel={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {!isInStock ? (
          <span className="absolute top-3 left-3 bg-slate-900/85 text-white text-xs font-medium px-2.5 py-1 rounded">
            Out of Stock
          </span>
        ) : discountPct > 0 ? (
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-semibold px-2.5 py-1 rounded tabular-nums">
            Save {discountPct}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-1.5">
          <span className="truncate font-medium text-slate-600">
            {categoryName || 'General'}
          </span>
          <span aria-hidden="true">·</span>
          <span className={isInStock ? 'text-emerald-700 font-medium shrink-0' : 'text-rose-700 font-medium shrink-0'}>
            {isInStock ? 'In Stock' : 'Unavailable'}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="font-display text-sm sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-3"
        >
          {product.name}
        </Link>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3 tabular-nums">
            <span className="text-sm sm:text-lg font-bold text-slate-900">
              {formatPKR(effectivePrice)}
            </span>
            {discountPct > 0 && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              disabled={!isInStock}
              onClick={() => addToCart(product.id, 1)}
              aria-label={`Add ${product.name} to Cart`}
              className="inline-flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span>{isInStock ? 'Add to Cart' : 'Sold Out'}</span>
            </button>

            <Link
              to={`/product/${product.id}`}
              aria-label={`View Details for ${product.name}`}
              className="inline-flex items-center justify-center gap-1 min-h-[40px] sm:min-h-[42px] px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
