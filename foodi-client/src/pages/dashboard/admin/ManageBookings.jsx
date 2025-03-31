import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all orders
  const { data: orders = [], refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/v1/orders');
      return res.data;
    }
  });

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/api/v1/orders/${orderId}`, {
        status: newStatus
      });
      if (res.data) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order status updated!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update order status.",
      });
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Manage <span className="text-green">Orders</span>
      </h2>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-green text-white">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Menu Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.customerName}</td>
                <td>{order.items.length} items</td>
                <td>${order.total}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'completed' ? 'badge-success' :
                    order.status === 'pending' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings; 