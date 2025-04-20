import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaBell } from 'react-icons/fa';

const ManageBookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const axiosSecure = useAxiosSecure();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get('/orders');
        const ordersData = response.data;
        
        console.log('Fetched orders:', ordersData); // Log for debugging
        
        // Sort orders with pending status first
        const sortedOrders = ordersData.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          // If both have same status, sort by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setOrders(sortedOrders);
        
        // Count pending orders that need confirmation
        const pendingOrdersCount = ordersData.filter(order => 
          order.status === 'pending'
        ).length;
        setPendingCount(pendingOrdersCount);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Set up interval to check for new orders every 60 seconds
    const intervalId = setInterval(fetchOrders, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [axiosSecure]);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log('Updating order:', orderId, 'to status:', newStatus); // Log for debugging
      
      if (!orderId) {
        throw new Error('Order ID is undefined');
      }

      // Show confirmation dialog before changing status
      const result = await Swal.fire({
        title: 'Confirm status change?',
        text: `Are you sure you want to change this order to "${newStatus}" status?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      });
      
      if (!result.isConfirmed) {
        return;
      }
      
      await axiosSecure.put(`/orders/${orderId}`, { 
        status: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update pending count if needed
      if (newStatus !== 'pending') {
        setPendingCount(prev => Math.max(0, prev - 1));
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Order status has been updated!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Unable to update status',
        text: error.message || error.response?.data?.message || 'An error occurred',
      });
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      // Show confirmation dialog before deleting
      const result = await Swal.fire({
        title: 'Confirm delete order?',
        text: 'Are you sure you want to delete this order? This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      });
      
      if (!result.isConfirmed) {
        return;
      }

      await axiosSecure.delete(`/orders/${orderId}`);
      
      // Update local state by removing the deleted order
      setOrders(orders.filter(order => (order.id || order._id) !== orderId));
      
      // Update pending count if needed
      if (orders.find(order => (order.id || order._id) === orderId)?.status === 'pending') {
        setPendingCount(prev => Math.max(0, prev - 1));
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Order deleted!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Unable to delete order',
        text: error.message || error.response?.data?.message || 'An error occurred',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Order Management</h2>
            {pendingCount > 0 && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                <FaBell className="mr-2" />
                <span>{pendingCount} orders pending confirmation</span>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => {
                  const orderId = order.id || order._id;
                  if (!orderId) {
                    console.error('Order without ID:', order);
                    return null;
                  }
                  return (
                    <tr key={orderId} className={order.status === 'pending' ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.email || order.userId}</div>
                        <div className="text-sm text-gray-500">{order.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${order.totalAmount || order.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'shipping' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {order.status === 'pending' ? 'Pending' : 
                           order.status === 'shipping' ? 'Shipping' : 
                           order.status === 'completed' ? 'Completed' :
                           order.status === 'cancelled' ? 'Cancelled' :
                           order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleStatusUpdate(orderId, 'shipping')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(orderId)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <select 
                              className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(orderId, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipping">Shipping</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button 
                              onClick={() => handleDeleteOrder(orderId)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;