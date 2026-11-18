import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/storeLogic';
import { SafeImage } from '../components/SafeImage';

export const CartPage: React.FC = () => {
  const { cartTotals, settings, updateCartQuantity, removeFromCart } = useStore();

  if (cartTotals.lines.length === 0) {
    return (
      <div className="bg-slate-50 min-h-[70vh] py-14 sm:py-20 px-4">
        <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
          {/* Custom Empty Bag Illustration */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="mx-auto mb-6"
          >
            <circle cx="48" cy="48" r="44" fill="#FFF7ED" />
            <rect
              x="26"
              y="34"
              width="44"
              height="36"
              rx="8"
              fill="#FFFFFF"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
            <path
              d="M37 34V29C37 22.9249 41.9249 18 48 18C54.0751 18 59 22.9249 59 29V34"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M40 50H56"
              stroke="#FED7AA"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <h1 className="font-display text-2xl font-bold text-slate-900">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 mb-7">
            Add books, dresses, clothes, shoes, bags, or cosmetics to get started with Cash on Delivery in {settings.deliveryCity}.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[70vh] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-600 mt-1 tabular-nums">
              {cartTotals.totalItems} {cartTotals.totalItems === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {cartTotals.lines.map((line) => (
              <div
                key={line.productId}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <Link
                    to={`/product/${line.productId}`}
                    aria-label={`View ${line.productName}`}
                    className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0"
                  >
                    <SafeImage
                      src={line.image}
                      alt={line.productName}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 space-y-1">
                    <Link
                      to={`/product/${line.productId}`}
                      className="font-display text-sm sm:text-base font-bold text-slate-900 hover:text-orange-600 line-clamp-2"
                    >
                      {line.productName}
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-500 tabular-nums">
                      Unit price: {formatPKR(line.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0">
                  <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(line.productId, line.quantity - 1)
                      }
                      aria-label={`Decrease quantity of ${line.productName}`}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-900 tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(line.productId, line.quantity + 1)
                      }
                      disabled={line.quantity >= line.product.stock}
                      aria-label={`Increase quantity of ${line.productName}`}
                      className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px] tabular-nums">
                    <p className="font-display text-sm sm:text-base font-bold text-slate-900">
                      {formatPKR(line.lineTotal)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(line.productId)}
                    aria-label={`Remove ${line.productName}`}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm tabular-nums">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span data-testid="cart-subtotal" className="font-semibold text-slate-900">
                  {formatPKR(cartTotals.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery ({settings.deliveryCity})</span>
                <span className="font-semibold text-slate-900">
                  {formatPKR(cartTotals.deliveryCharge)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span data-testid="cart-total" className="text-lg text-orange-600">
                  {formatPKR(cartTotals.grandTotal)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              Payment Method: <strong>Cash on Delivery (COD)</strong> · Home delivery demonstrated for {settings.deliveryCity}.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full min-h-[48px] px-5 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/shop"
                className="flex items-center justify-center w-full min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
