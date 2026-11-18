export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isDemo?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  available: boolean;
  featured: boolean;
  images: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CheckoutFormInput {
  fullName: string;
  mobile: string;
  whatsapp: string;
  city: string;
  address: string;
  instructions: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  city: string;
  address: string;
  instructions: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  createdAt: string;
  whatsappMessage: string;
  whatsappUrl: string;
  isDemo?: boolean;
}

export interface StoreSettings {
  storeName: string;
  whatsappDisplay: string;
  whatsappInternational: string;
  deliveryCharge: number;
  deliveryCity: string;
  storeDescription: string;
  announcementMessage: string;
}

export interface CustomerSummary {
  key: string;
  name: string;
  mobile: string;
  whatsapp: string;
  city: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';
