import React, { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types';
import { formatDeliveryAddress, formatPKR } from '../../utils/storeLogic';

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (
        q &&
        !`${order.id} ${order.customerName} ${order.mobile} ${order.address}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          Demo Orders ({orders.length})
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update Cash on Delivery order statuses as parcels move from Pending to Delivered.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="admin-order-search" className="sr-only">
            Search orders
          </label>
          <input
            id="admin-order-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (LS-1001), customer name, or phone..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
          />
        </div>
        <select
          aria-label="Filter orders by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white"
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {order.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600">
                  {new Date(order.createdAt).toLocaleString('en-PK', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-700">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor={`status-${order.id}`} className="text-xs font-semibold text-slate-600">
                  Status:
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value as OrderStatus)
                  }
                  className="h-9 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 cursor-pointer focus:outline-none focus:border-orange-600"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
              <div className="md:col-span-5 space-y-1">
                <p className="font-semibold text-slate-900">{order.customerName}</p>
                <p className="text-xs text-slate-600 tabular-nums">
                  Phone: {order.mobile} · WhatsApp: {order.whatsapp}
                </p>
                <p className="text-xs text-slate-600">
                  {formatDeliveryAddress(order.address, order.city)}
                </p>
                {order.instructions && (
                  <p className="text-xs text-slate-500 italic">
                    Note: {order.instructions}
                  </p>
                )}
              </div>

              <div className="md:col-span-5 space-y-1">
                <p className="text-xs font-semibold text-slate-500">Ordered Items</p>
                <ul className="text-xs text-slate-700 space-y-1 tabular-nums">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.productId}`}>
                      {item.productName} × {item.quantity} ({formatPKR(item.lineTotal)})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 flex flex-col md:items-end justify-between gap-2 tabular-nums">
                <div className="md:text-right">
                  <p className="text-xs text-slate-500">Total Amount</p>
                  <p className="font-display text-lg font-bold text-orange-600">
                    {formatPKR(order.total)}
                  </p>
                </div>
                {order.whatsappUrl && (
                  <a
                    href={order.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-orange-600"
                  >
                    <span>WhatsApp Link</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
            No demo orders match your filters.
          </div>
        )}
      </div>
    </div>
  );
};
