import React from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types';
import { computeDashboardMetrics, formatPKR } from '../../utils/storeLogic';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: 'products' | 'orders') => void;
}

const STATUS_LIST: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
}) => {
  const { products, categories, orders } = useStore();
  const metrics = computeDashboardMetrics(products, orders);

  const statusCounts = STATUS_LIST.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const categoryBreakdown = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    return { name: cat.name, count };
  });
  const maxCatCount = Math.max(1, ...categoryBreakdown.map((c) => c.count));

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Products',
            value: String(metrics.totalProducts),
            sub: `${metrics.availableProducts} available`,
            icon: Package,
          },
          {
            label: 'Total Orders',
            value: String(metrics.totalOrders),
            sub: 'COD demo orders',
            icon: ShoppingCart,
          },
          {
            label: 'Pending Orders',
            value: String(metrics.pendingOrders),
            sub: 'Awaiting confirmation',
            icon: Clock,
          },
          {
            label: 'Completed Orders',
            value: String(metrics.completedOrders),
            sub: 'Marked delivered',
            icon: CheckCircle2,
          },
          {
            label: 'Total Demo Sales',
            value: formatPKR(metrics.totalDemoSales),
            sub: 'Excluding cancelled',
            icon: DollarSign,
            highlight: true,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-xl border p-5 space-y-2 ${
                card.highlight
                  ? 'bg-orange-50/70 border-orange-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{card.label}</span>
                <Icon
                  className={`w-4 h-4 ${
                    card.highlight ? 'text-orange-600' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                {card.value}
              </p>
              <p className="text-xs text-slate-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Orders by Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live distribution across demo fulfillment stages
            </p>
          </div>
          <div className="space-y-3">
            {statusCounts.map((row) => (
              <div key={row.status} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700 tabular-nums">
                  <span>{row.status}</span>
                  <span>{row.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      row.status === 'Delivered'
                        ? 'bg-emerald-600'
                        : row.status === 'Cancelled'
                          ? 'bg-rose-500'
                          : 'bg-orange-600'
                    }`}
                    style={{ width: `${(row.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Inventory Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Catalog by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Number of products listed per category
            </p>
          </div>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700 tabular-nums">
                  <span>{cat.name}</span>
                  <span>{cat.count} products</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-800 transition-all"
                    style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h2 className="font-display text-base font-bold text-slate-900">
            Recent Demo Orders
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Manage Products
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              View All Orders →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">City</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{order.city}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                    {order.status}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums">
                    {formatPKR(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
