import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/seedData';
import type {
  CartItem,
  Category,
  CheckoutFormInput,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from '../types';
import {
  buildWhatsAppUrl,
  calculateCartTotals,
  formatWhatsAppOrderMessage,
  generateOrderId,
  normalizeWhatsAppNumber,
} from '../utils/storeLogic';

const STORAGE_KEYS = {
  products: 'ls_demo_products_v1',
  categories: 'ls_demo_categories_v1',
  orders: 'ls_demo_orders_v1',
  cart: 'ls_demo_cart_v1',
  settings: 'ls_demo_settings_v1',
  adminAuth: 'ls_demo_admin_auth_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in demo mode
  }
}

export interface ToastNotice {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'error';
}

interface StoreContextValue {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
  isAdminAuthenticated: boolean;
  toasts: ToastNotice[];
  dismissToast: (id: string) => void;
  notify: (message: string, tone?: ToastNotice['tone']) => void;

  // Cart actions
  cartTotals: ReturnType<typeof calculateCartTotals>;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Checkout / Order actions
  placeCodOrder: (input: CheckoutFormInput) => Order;

  // Admin auth
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;

  // Admin Product CRUD
  addProduct: (input: Omit<Product, 'id' | 'slug' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Admin Category CRUD
  addCategory: (input: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;

  // Admin Order & Settings
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(STORAGE_KEYS.products, INITIAL_PRODUCTS),
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    readStorage<Category[]>(STORAGE_KEYS.categories, INITIAL_CATEGORIES),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage<Order[]>(STORAGE_KEYS.orders, INITIAL_ORDERS),
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.cart, []),
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    readStorage<StoreSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS),
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEYS.adminAuth, false),
  );
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  useEffect(() => writeStorage(STORAGE_KEYS.products, products), [products]);
  useEffect(() => writeStorage(STORAGE_KEYS.categories, categories), [categories]);
  useEffect(() => writeStorage(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStorage(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => writeStorage(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => writeStorage(STORAGE_KEYS.adminAuth, isAdminAuthenticated), [isAdminAuthenticated]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const notify = (message: string, tone: ToastNotice['tone'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, products, settings.deliveryCharge),
    [cart, products, settings.deliveryCharge],
  );

  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.available || product.stock <= 0) {
      notify('This item is currently unavailable.', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { productId, quantity: Math.min(product.stock, Math.max(1, quantity)) }];
    });
    notify(`Added "${product.name}" to your bag.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    const maxAllowed = product ? Math.max(1, product.stock) : quantity;
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(maxAllowed, quantity) } : i,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    notify('Item removed from bag.', 'info');
  };

  const clearCart = () => setCart([]);

  const placeCodOrder = (input: CheckoutFormInput): Order => {
    const orderId = generateOrderId(orders);
    const items = cartTotals.lines.map(({ productId, productName, unitPrice, quantity, lineTotal, image }) => ({
      productId,
      productName,
      unitPrice,
      quantity,
      lineTotal,
      image,
    }));

    const whatsappMessage = formatWhatsAppOrderMessage({
      storeName: settings.storeName,
      orderId,
      customerName: input.fullName.trim(),
      mobile: input.mobile.trim(),
      whatsapp: input.whatsapp.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
      instructions: input.instructions.trim(),
      items,
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.deliveryCharge,
      total: cartTotals.grandTotal,
    });

    const whatsappUrl = buildWhatsAppUrl(
      settings.whatsappInternational || settings.whatsappDisplay,
      whatsappMessage,
    );

    const newOrder: Order = {
      id: orderId,
      customerName: input.fullName.trim(),
      mobile: input.mobile.trim(),
      whatsapp: input.whatsapp.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
      instructions: input.instructions.trim(),
      items,
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.deliveryCharge,
      total: cartTotals.grandTotal,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      whatsappMessage,
      whatsappUrl,
      isDemo: true,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const loginAdmin = (email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === 'admin@larkanastore.com' &&
      password === 'Admin123!'
    ) {
      setIsAdminAuthenticated(true);
      notify('Signed in to Larkana Store Admin Demo.');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    notify('Logged out of Admin Panel.', 'info');
  };

  const addProduct = (input: Omit<Product, 'id' | 'slug' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const next: Product = {
      ...input,
      id,
      slug: `${slugify(input.name)}-${id.slice(-4)}`,
      createdAt: new Date().toISOString(),
      isDemo: input.isDemo ?? false,
    };
    setProducts((prev) => [next, ...prev]);
    notify(`Product "${next.name}" added.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              slug: updates.name ? slugify(updates.name) : p.slug,
            }
          : p,
      ),
    );
    notify('Product updated.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
    notify('Product removed.', 'info');
  };

  const addCategory = (input: Omit<Category, 'id' | 'slug'>) => {
    const id = `cat-${slugify(input.name)}-${Date.now().toString().slice(-4)}`;
    const next: Category = {
      ...input,
      id,
      slug: slugify(input.name),
      isDemo: false,
    };
    setCategories((prev) => [...prev, next]);
    notify(`Category "${next.name}" created.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, slug: updates.name ? slugify(updates.name) : c.slug }
          : c,
      ),
    );
    notify('Category updated.');
  };

  const deleteCategory = (id: string): boolean => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) {
      notify('Reassign or remove products in this category before deleting it.', 'error');
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    notify('Category deleted.', 'info');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    notify(`Order ${orderId} marked as ${status}.`);
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...updates };
      if (updates.whatsappDisplay && !updates.whatsappInternational) {
        merged.whatsappInternational = normalizeWhatsAppNumber(updates.whatsappDisplay);
      }
      return merged;
    });
    notify('Store settings saved.');
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    notify('All demo data restored to initial state.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        settings,
        isAdminAuthenticated,
        toasts,
        dismissToast,
        notify,
        cartTotals,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeCodOrder,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
