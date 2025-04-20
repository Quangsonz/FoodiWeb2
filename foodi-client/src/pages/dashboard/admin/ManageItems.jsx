import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageItems = () => {
  const axiosSecure = useAxiosSecure();
  
  // Fetch menu items
  const { data: menuItems = [], refetch, isLoading, error } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      try {
        console.log('Fetching menu items...');
        const res = await axiosSecure.get('/menu');
        console.log('Menu items response:', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
    }
  });

  // Delete menu item
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/menu/${item._id}`);
          if (res.data) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Menu item has been deleted.",
              icon: "success"
            });
          }
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete menu item.",
            icon: "error"
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-[870px] px-4 mx-auto">
        <h2 className="text-2xl font-semibold my-4">
          Loading menu items...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[870px] px-4 mx-auto">
        <h2 className="text-2xl font-semibold my-4 text-red-500">
          Error loading menu items: {error.message}
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Manage All <span className="text-green">Menu Items</span>
      </h2>

      {/* Menu Items Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-green text-white">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id || item.id}>
                <td>{menuItems.indexOf(item) + 1}</td>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img 
                        src={item.image} 
                        alt={item.name || 'Menu item'}
                      />
                    </div>
                  </div>
                </td>
                <td>{item.name}</td>
                <td>
                  <span className="capitalize px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                    {item.category}
                  </span>
                </td>
                <td>${item.price}</td>
                <td>
                  <Link 
                    to={`/dashboard/update-menu/${item._id || item.id}`}
                    state={item}
                  >
                    <button className="btn btn-ghost btn-sm text-blue-500">
                      <FaEdit />
                    </button>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="btn btn-ghost btn-sm text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;