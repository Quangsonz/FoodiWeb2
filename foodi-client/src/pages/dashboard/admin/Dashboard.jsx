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
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Admin <span className="text-green">Dashboard</span>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="stat-figure text-white">
            <FaDollarSign className="text-3xl"/>
          </div>
          <div className="stat-title text-white opacity-80">Revenue</div>
          <div className="stat-value text-2xl">${stats.revenue || 0}</div>
          <div className="stat-desc text-white opacity-80">↗︎ 11% more than last month</div>
        </div>

        <div className="stat bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="stat-figure text-white">
            <FaUsers className="text-3xl"/>
          </div>
          <div className="stat-title text-white opacity-80">Users</div>
          <div className="stat-value text-2xl">{stats.users || 0}</div>
          <div className="stat-desc text-white opacity-80">↗︎ 5% more than last month</div>
        </div>

        <div className="stat bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <div className="stat-figure text-white">
            <FaBook className="text-3xl"/>
          </div>
          <div className="stat-title text-white opacity-80">Menu Items</div>
          <div className="stat-value text-2xl">{stats.menuItems || 0}</div>
          <div className="stat-desc text-white opacity-80">↗︎ 8% more than last month</div>
        </div>

        <div className="stat bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="stat-figure text-white">
            <FaListAlt className="text-3xl"/>
          </div>
          <div className="stat-title text-white opacity-80">Orders</div>
          <div className="stat-value text-2xl">{stats.orders || 0}</div>
          <div className="stat-desc text-white opacity-80">↗︎ 15% more than last month</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Menu Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.customerName}</td>
                  <td>{order.items.length} items</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' :
                      order.status === 'pending' ? 'badge-warning' :
                      'badge-error'
                    } text-xs px-2 py-1 rounded`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard