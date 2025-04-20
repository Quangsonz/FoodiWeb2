import React from 'react'
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaBook, FaUsers, FaDollarSign, FaListAlt, FaChartLine, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
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

      {/* Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Monthly Revenue</h3>
            <FaChartLine className="text-gray-400 text-xl" />
          </div>
          <div className="space-y-4">
            {/* Monthly Stats */}
            {['January', 'February', 'March', 'April'].map((month, index) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-gray-600">{month}</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-purple-500 rounded-full" 
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-gray-900 font-medium">${(index + 1) * 1000}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Category Performance</h3>
            <FaChartBar className="text-gray-400 text-xl" />
          </div>
          <div className="space-y-6">
            {/* Category Stats */}
            {[
              { name: 'Main Course', value: 45, color: 'bg-blue-500' },
              { name: 'Appetizers', value: 30, color: 'bg-green-500' },
              { name: 'Desserts', value: 15, color: 'bg-yellow-500' },
              { name: 'Beverages', value: 10, color: 'bg-red-500' }
            ].map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="text-gray-900 font-medium">{category.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 ${category.color} rounded-full`}
                    style={{ width: `${category.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Popular Items</h3>
          <div className="space-y-4">
            {[
              { name: 'Roast Duck', orders: 150 },
              { name: 'Beef Steak', orders: 120 },
              { name: 'Pasta', orders: 90 }
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-gray-600">{item.name}</span>
                <span className="text-sm font-medium bg-green-100 text-green-800 py-1 px-3 rounded-full">
                  {item.orders} orders
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Satisfaction</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
              <div className="text-gray-500">Positive Reviews</div>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {[
              { time: '12:00 - 14:00', percentage: 85 },
              { time: '18:00 - 20:00', percentage: 95 },
              { time: '20:00 - 22:00', percentage: 75 }
            ].map((peak) => (
              <div key={peak.time} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{peak.time}</span>
                  <span className="text-gray-900">{peak.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${peak.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;