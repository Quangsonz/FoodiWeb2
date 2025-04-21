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
        
        // Transform the data to ensure each item has _id
        const transformedData = res.data.map(item => ({
          ...item,
          _id: item._id || item.id // Use _id if available, otherwise use id
        }));
        
        console.log('Transformed menu items:', transformedData);
        return transformedData;
      } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
    }
  });

  // Delete menu item
  const handleDeleteItem = async (item) => {
    console.log('Attempting to delete item:', item);
    
    // Check if item has either _id or id
    const itemId = item._id || item.id;
    
    if (!itemId) {
      console.error('No valid ID found for item:', item);
      Swal.fire({
        title: "Error!",
        text: "Cannot delete item - No valid ID found",
        icon: "error"
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to delete ${item.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        try {
          console.log('Sending delete request for item:', {
            id: itemId,
            name: item.name,
            category: item.category
          });
          
          const res = await axiosSecure.delete(`/menu/${itemId}`);
          console.log('Delete response:', res);

          if (res.status === 200) {
            await refetch(); // Refresh the menu items list
            Swal.fire({
              title: "Deleted!",
              text: `${item.name} has been deleted.`,
              icon: "success"
            });
          }
        } catch (error) {
          console.error('Delete error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            itemId: itemId
          });
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to delete menu item.",
            icon: "error"
          });
        }
      }
    } catch (error) {
      console.error('Delete operation error:', error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred",
        icon: "error"
      });
    }
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
            {Array.isArray(menuItems) && menuItems.map((item, index) => {
              const itemId = item._id || item.id;
              return (
                <tr key={`${itemId}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img 
                          src={item.image} 
                          alt={item.name || 'Menu item'}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
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
                      to={`/dashboard/update-menu/${itemId}`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;