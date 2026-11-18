import type {
  CartItem,
  Category,
  CheckoutFormInput,
  CustomerSummary,
  Order,
  OrderItem,
  Product,
  SortOption,
} from '../types';

export function formatPKR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `Rs. ${safe.toLocaleString('en-PK')}`;
}

export function getEffectivePrice(product: Pick<Product, 'price' | 'discountPrice'>): number {
  if (
    typeof product.discountPrice === 'number' &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  ) {
    return product.discountPrice;
  }
  return product.price;
}

export function getDiscountPercent(product: Pick<Product, 'price' | 'discountPrice'>): number {
  const effective = getEffectivePrice(product);
  if (effective >= product.price || product.price <= 0) return 0;
  return Math.round(((product.price - effective) / product.price) * 100);
}

export interface ProductFilterOptions {
  categoryId?: string;
  search?: string;
  onlyAvailable?: boolean;
  sortBy?: SortOption;
  categories?: Category[];
}

export function filterAndSortProducts(
  products: Product[],
  options: ProductFilterOptions = {},
): Product[] {
  const {
    categoryId = 'all',
    search = '',
    onlyAvailable = false,
    sortBy = 'newest',
    categories = [],
  } = options;

  const query = search.trim().toLowerCase();
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));

  const filtered = products.filter((product) => {
    if (categoryId && categoryId !== 'all' && product.categoryId !== categoryId) {
      return false;
    }
    if (onlyAvailable && (!product.available || product.stock <= 0)) {
      return false;
    }
    if (query) {
      const catName = categoryNameById.get(product.categoryId) ?? '';
      const haystack = `${product.name} ${product.description} ${catName}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (sortBy === 'price-asc') {
      return getEffectivePrice(a) - getEffectivePrice(b);
    }
    if (sortBy === 'price-desc') {
      return getEffectivePrice(b) - getEffectivePrice(a);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sorted;
}

export interface CartCalculation {
  lines: Array<OrderItem & { product: Product }>;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
}

export function calculateCartTotals(
  cartItems: CartItem[],
  products: Product[],
  deliveryCharge: number,
): CartCalculation {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines: Array<OrderItem & { product: Product }> = [];
  let subtotal = 0;
  let totalItems = 0;

  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product || item.quantity <= 0) continue;
    const unitPrice = getEffectivePrice(product);
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;
    lines.push({
      productId: product.id,
      productName: product.name,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      image: product.images[0],
      product,
    });
  }

  const appliedDelivery = lines.length > 0 ? Math.max(0, deliveryCharge) : 0;

  return {
    lines,
    totalItems,
    subtotal,
    deliveryCharge: appliedDelivery,
    grandTotal: subtotal + appliedDelivery,
  };
}

export type CheckoutValidationErrors = Partial<Record<keyof CheckoutFormInput, string>>;

function isValidPakPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function validateCheckoutForm(input: CheckoutFormInput): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!input.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!isValidPakPhone(input.mobile)) {
    errors.mobile = 'Enter a valid mobile number (e.g. 03001234567).';
  }
  if (!input.whatsapp.trim()) {
    errors.whatsapp = 'WhatsApp number is required for order updates.';
  } else if (!isValidPakPhone(input.whatsapp)) {
    errors.whatsapp = 'Enter a valid WhatsApp number (e.g. 03221393770).';
  }
  if (!input.city.trim()) {
    errors.city = 'Delivery city is required.';
  }
  if (!input.address.trim() || input.address.trim().length < 8) {
    errors.address = 'Please enter a complete street/mohalla address in Larkana.';
  }

  return errors;
}

export function generateOrderId(existingOrders: Pick<Order, 'id'>[]): string {
  let maxNum = 1000;
  for (const order of existingOrders) {
    const match = /^LS-(\d+)$/i.exec(order.id.trim());
    if (match) {
      const parsed = Number.parseInt(match[1], 10);
      if (parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }
  return `LS-${maxNum + 1}`;
}

export function normalizeWhatsAppNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  if (digits.startsWith('92')) {
    return digits;
  }
  return digits || '923221393770';
}

export interface WhatsAppMessagePayload {
  storeName: string;
  orderId: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  city: string;
  address: string;
  instructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

export function formatWhatsAppOrderMessage(payload: WhatsAppMessagePayload): string {
  const itemLines = payload.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.productName} x ${item.quantity} = ${formatPKR(item.lineTotal)}`,
    )
    .join('\n');

  const instructionBlock = payload.instructions?.trim()
    ? `\nInstructions: ${payload.instructions.trim()}`
    : '';

  return [
    `Assalam o Alaikum ${payload.storeName}!`,
    '',
    'I want to place an order.',
    '',
    `Order ID: ${payload.orderId}`,
    '',
    'Customer Details:',
    `Name: ${payload.customerName}`,
    `Phone: ${payload.mobile}`,
    `WhatsApp: ${payload.whatsapp}`,
    `City: ${payload.city}`,
    `Address: ${payload.address}${instructionBlock}`,
    '',
    'Order Items:',
    itemLines,
    '',
    `Subtotal: ${formatPKR(payload.subtotal)}`,
    `Delivery: ${formatPKR(payload.deliveryCharge)}`,
    `Total: ${formatPKR(payload.total)}`,
    '',
    'Payment Method: Cash on Delivery',
    '',
    'Please confirm my order.',
  ].join('\n');
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const normalized = normalizeWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export interface DashboardMetrics {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalDemoSales: number;
}

export function computeDashboardMetrics(products: Product[], orders: Order[]): DashboardMetrics {
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available && p.stock > 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalDemoSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalProducts,
    availableProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalDemoSales,
  };
}

export function deriveCustomersFromOrders(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const key = order.mobile.replace(/\D/g, '') || order.customerName.toLowerCase();
    const existing = map.get(key);
    const amount = order.status === 'Cancelled' ? 0 : order.total;

    if (!existing) {
      map.set(key, {
        key,
        name: order.customerName,
        mobile: order.mobile,
        whatsapp: order.whatsapp,
        city: order.city,
        address: order.address,
        ordersCount: 1,
        totalSpent: amount,
        lastOrderDate: order.createdAt,
      });
    } else {
      existing.ordersCount += 1;
      existing.totalSpent += amount;
      if (new Date(order.createdAt).getTime() > new Date(existing.lastOrderDate).getTime()) {
        existing.lastOrderDate = order.createdAt;
        existing.address = order.address;
        existing.name = order.customerName;
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime(),
  );
}

export function formatDeliveryAddress(address: string, city: string): string {
  const cleanAddress = address.trim();
  const cleanCity = city.trim();
  if (!cleanCity) return cleanAddress;
  if (cleanAddress.toLowerCase().includes(cleanCity.toLowerCase())) {
    return cleanAddress;
  }
  return `${cleanAddress}, ${cleanCity}`;
}

