import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useMenu from '../../hooks/useMenu';
import { FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BsBox } from 'react-icons/bs';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [menu, menuLoading] = useMenu();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.email) {
        try {
          setLoading(true);
          setError(null);
          
          const response = await axiosSecure.get('/orders');
          
          if (response && response.data) {
            const userOrders = response.data
              .filter(order => order.userId === user.email)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(userOrders);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Failed to load orders. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user, axiosSecure]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipping':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading states
  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please login to view your orders</h2>
      </div>
    );
  }

  if (loading || menuLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ee4d2d] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 pt-20">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Orders</h1>
        <p className="text-gray-600">Monitor your order status in real-time</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <BsBox className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, orderIndex) => (
            <div key={`order-${order._id || orderIndex}`} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.customerName || 'Customer'} ({order.userId || 'No email'})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on: {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                      <FaClock className="w-4 h-4" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600">Pending</p>
                  </div>
                  <div className={`flex-1 h-1 mx-4 ${order.status === 'shipping' ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'shipping' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                      <FaShippingFast className="w-4 h-4" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600">Shipping</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items?.map((item, itemIndex) => {
                    const menuItem = menu.find(m => m.name === item.name);
                    return (
                      <div key={`${order._id}-item-${itemIndex}`} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img
                            src={menuItem?.image || '/images/placeholder-food.png'}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-food.png';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium text-[#ee4d2d]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Delivery to: <span className="font-medium text-gray-900">{order.address}</span></p>
                    <p>Contact: <span className="font-medium text-gray-900">{order.phone}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount:</p>
                    <p className="text-xl font-bold text-[#ee4d2d]">${order.total?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;