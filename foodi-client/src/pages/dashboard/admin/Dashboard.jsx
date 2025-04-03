import React from 'react'
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaBook, FaUsers, FaDollarSign, FaListAlt } from 'react-icons/fa';

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/v1/admin/stats');
      return res.data;
    }
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/v1/orders/recent');
      return res.data;
    }
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-8">
        Admin <span className="text-green">Dashboard</span>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium opacity-90">Revenue</div>
            <FaDollarSign className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-2">${stats.revenue || 0}</div>
          <div className="text-sm opacity-80">↗︎ 11% more than last month</div>
        </div>

        {/* Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium opacity-90">Users</div>
            <FaUsers className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.users || 0}</div>
          <div className="text-sm opacity-80">↗︎ 5% more than last month</div>
        </div>

        {/* Menu Items Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium opacity-90">Menu Items</div>
            <FaBook className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.menuItems || 0}</div>
          <div className="text-sm opacity-80">↗︎ 8% more than last month</div>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium opacity-90">Orders</div>
            <FaListAlt className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.orders || 0}</div>
          <div className="text-sm opacity-80">↗︎ 15% more than last month</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 whitespace-nowrap">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No orders found
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

export default Dashboard;