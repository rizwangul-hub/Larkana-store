import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { deriveCustomersFromOrders, formatDeliveryAddress, formatPKR } from '../../utils/storeLogic';

export const AdminCustomersTab: React.FC = () => {
  const { orders } = useStore();
  const customers = useMemo(() => deriveCustomersFromOrders(orders), [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          Customers ({customers.length})
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Customer directory automatically aggregated from Cash on Delivery demo orders.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer Name</th>
                <th className="py-3 px-4 font-semibold">Mobile / WhatsApp</th>
                <th className="py-3 px-4 font-semibold">Delivery Address</th>
                <th className="py-3 px-4 font-semibold text-right">Orders</th>
                <th className="py-3 px-4 font-semibold text-right">Demo Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.key} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {customer.name}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 tabular-nums">
                    <div>{customer.mobile}</div>
                    <div className="text-slate-400">WA: {customer.whatsapp}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-xs">
                    {formatDeliveryAddress(customer.address, customer.city)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800 tabular-nums">
                    {customer.ordersCount}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatPKR(customer.totalSpent)}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                    No customer records yet. Place a demo checkout order to see customers appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
