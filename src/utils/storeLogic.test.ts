import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  calculateCartTotals,
  computeDashboardMetrics,
  deriveCustomersFromOrders,
  filterAndSortProducts,
  formatDeliveryAddress,
  formatPKR,
  formatWhatsAppOrderMessage,
  generateOrderId,
  getDiscountPercent,
  getEffectivePrice,
  normalizeWhatsAppNumber,
  validateCheckoutForm,
} from './storeLogic';
import type { Order, Product } from '../types';

const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Embroidered Lawn Dress',
    slug: 'embroidered-lawn-dress',
    categoryId: 'cat-dresses',
    description: 'Summer 3-piece lawn suit.',
    price: 4500,
    discountPrice: 3600,
    stock: 10,
    available: true,
    featured: true,
    images: ['/img1.jpg'],
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    categoryId: 'cat-shoes',
    description: 'Lightweight athletic sneakers.',
    price: 3800,
    stock: 0,
    available: false,
    featured: false,
    images: ['/img2.jpg'],
    createdAt: '2026-10-05T10:00:00.000Z',
  },
  {
    id: 'p3',
    name: 'CSS Exam Prep Guide',
    slug: 'css-exam-prep-guide',
    categoryId: 'cat-books',
    description: 'Complete handbook for competitive exams.',
    price: 1200,
    stock: 15,
    available: true,
    featured: true,
    images: ['/img3.jpg'],
    createdAt: '2026-10-10T10:00:00.000Z',
  },
];

test('pricing and discount helpers compute effective PKR pricing', () => {
  assert.equal(getEffectivePrice(sampleProducts[0]), 3600);
  assert.equal(getDiscountPercent(sampleProducts[0]), 20);
  assert.equal(getEffectivePrice(sampleProducts[1]), 3800);
  assert.equal(getDiscountPercent(sampleProducts[1]), 0);
  assert.equal(formatPKR(3600), 'Rs. 3,600');
});

test('filterAndSortProducts filters by category, search, availability, and sorts correctly', () => {
  const availableOnly = filterAndSortProducts(sampleProducts, { onlyAvailable: true });
  assert.equal(availableOnly.length, 2);

  const byCategory = filterAndSortProducts(sampleProducts, { categoryId: 'cat-books' });
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, 'p3');

  const byPriceAsc = filterAndSortProducts(sampleProducts, { sortBy: 'price-asc' });
  assert.deepEqual(
    byPriceAsc.map((p) => p.id),
    ['p3', 'p1', 'p2'],
  );

  const bySearch = filterAndSortProducts(sampleProducts, { search: 'lawn' });
  assert.equal(bySearch.length, 1);
  assert.equal(bySearch[0].id, 'p1');
});

test('calculateCartTotals computes subtotal, delivery fee, and grand total', () => {
  const empty = calculateCartTotals([], sampleProducts, 150);
  assert.equal(empty.totalItems, 0);
  assert.equal(empty.deliveryCharge, 0);
  assert.equal(empty.grandTotal, 0);

  const calc = calculateCartTotals(
    [
      { productId: 'p1', quantity: 2 },
      { productId: 'p3', quantity: 1 },
    ],
    sampleProducts,
    150,
  );
  assert.equal(calc.totalItems, 3);
  assert.equal(calc.subtotal, 8400);
  assert.equal(calc.deliveryCharge, 150);
  assert.equal(calc.grandTotal, 8550);
});

test('validateCheckoutForm enforces required customer fields', () => {
  const emptyErrors = validateCheckoutForm({
    fullName: '',
    mobile: '123',
    whatsapp: '',
    city: '',
    address: 'Short',
    instructions: '',
  });
  assert.ok(emptyErrors.fullName);
  assert.ok(emptyErrors.mobile);
  assert.ok(emptyErrors.whatsapp);
  assert.ok(emptyErrors.city);
  assert.ok(emptyErrors.address);

  const validErrors = validateCheckoutForm({
    fullName: 'Bilawal Bhutto Road Customer',
    mobile: '03001234567',
    whatsapp: '03221393770',
    city: 'Larkana',
    address: 'House 14, Sachal Colony, Larkana',
    instructions: 'Call before delivery',
  });
  assert.deepEqual(validErrors, {});
});

test('WhatsApp order formatting and URL encoding work accurately', () => {
  assert.equal(normalizeWhatsAppNumber('03221393770'), '923221393770');
  assert.equal(normalizeWhatsAppNumber('923221393770'), '923221393770');

  const msg = formatWhatsAppOrderMessage({
    storeName: 'Larkana Store',
    orderId: 'LS-1001',
    customerName: 'Ahsan Ali',
    mobile: '03001234567',
    whatsapp: '03221393770',
    city: 'Larkana',
    address: 'Jinnah Bagh Road, Larkana',
    items: [
      {
        productId: 'p1',
        productName: 'Embroidered Lawn Dress',
        unitPrice: 3600,
        quantity: 1,
        lineTotal: 3600,
      },
    ],
    subtotal: 3600,
    deliveryCharge: 150,
    total: 3750,
  });

  assert.match(msg, /Assalam o Alaikum Larkana Store!/);
  assert.match(msg, /Order ID: LS-1001/);
  assert.match(msg, /Payment Method: Cash on Delivery/);
  assert.match(msg, /Total: Rs\. 3,750/);

  const url = buildWhatsAppUrl('923221393770', msg);
  assert.ok(url.startsWith('https://wa.me/923221393770?text='));
  assert.ok(url.includes(encodeURIComponent('Order ID: LS-1001')));
});

test('generateOrderId, computeDashboardMetrics, and deriveCustomersFromOrders work correctly', () => {
  const sampleOrders: Order[] = [
    {
      id: 'LS-1001',
      customerName: 'Sana Mir',
      mobile: '03001112233',
      whatsapp: '03001112233',
      city: 'Larkana',
      address: 'Lahori Mohalla, Larkana',
      instructions: '',
      items: [],
      subtotal: 2000,
      deliveryCharge: 150,
      total: 2150,
      paymentMethod: 'Cash on Delivery',
      status: 'Delivered',
      createdAt: '2026-10-12T10:00:00.000Z',
      whatsappMessage: '',
      whatsappUrl: '',
    },
    {
      id: 'LS-1002',
      customerName: 'Sana Mir',
      mobile: '03001112233',
      whatsapp: '03001112233',
      city: 'Larkana',
      address: 'Station Road, Larkana',
      instructions: '',
      items: [],
      subtotal: 1000,
      deliveryCharge: 150,
      total: 1150,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      createdAt: '2026-10-15T10:00:00.000Z',
      whatsappMessage: '',
      whatsappUrl: '',
    },
  ];

  assert.equal(generateOrderId(sampleOrders), 'LS-1003');
  const metrics = computeDashboardMetrics(sampleProducts, sampleOrders);
  assert.equal(metrics.totalProducts, 3);
  assert.equal(metrics.totalOrders, 2);
  assert.equal(metrics.pendingOrders, 1);
  assert.equal(metrics.completedOrders, 1);
  assert.equal(metrics.totalDemoSales, 3300);

  const customers = deriveCustomersFromOrders(sampleOrders);
  assert.equal(customers.length, 1);
  assert.equal(customers[0].ordersCount, 2);
  assert.equal(customers[0].totalSpent, 3300);

  assert.equal(
    formatDeliveryAddress('House 12, Lahori Mohalla, Larkana', 'Larkana'),
    'House 12, Lahori Mohalla, Larkana',
  );
  assert.equal(
    formatDeliveryAddress('House 12, Lahori Mohalla', 'Larkana'),
    'House 12, Lahori Mohalla, Larkana',
  );
});

