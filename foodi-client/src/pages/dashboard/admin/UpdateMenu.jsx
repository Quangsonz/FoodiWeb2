import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaUtensils } from 'react-icons/fa';

const UpdateMenu = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state || null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        if (!item && id) {
          console.log('Fetching menu item with id:', id);
          const response = await axiosSecure.get(`/menu/${id}`);
          console.log('Fetched menu item:', response.data);
          setItem(response.data);
        }
      } catch (error) {
        console.error('Error fetching menu item:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load menu item"
        });
      }
    };

    fetchMenuItem();
  }, [id, axiosSecure, item]);

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = item.image;

      // Upload new image if provided
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        
        try {
          // Use axiosPublic for image upload to imgbb
          const res = await axiosPublic.post(image_hosting_api, formData);
          if (res.data.success) {
            imageUrl = res.data.data.display_url;
          } else {
            throw new Error('Failed to upload image');
          }
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      // Update menu item using axiosSecure with PUT method
      const updatedItem = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        recipe: data.recipe,
        image: imageUrl
      };

      console.log('Updating menu item:', id, updatedItem);
      const menuRes = await axiosSecure.put(`/menu/${id}`, updatedItem);
      console.log('Update response:', menuRes);

      if (menuRes.data) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Menu Item Updated!",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/dashboard/manage-items');
      }
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="w-full md:w-[870px] px-4 mx-auto">
        <h2 className="text-2xl font-semibold my-4 text-red-500">
          Loading menu item...
        </h2>
      </div>
    );
  }

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update Menu Item: <span className="text-green">{item.name}</span>
      </h2>

      <div className="bg-[#F3F3F3] p-6 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Recipe Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              defaultValue={item.name}
              {...register("name", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.name && <span className="text-red-500">Recipe name is required</span>}
          </div>

          {/* Category and Price Row */}
          <div className="flex gap-6">
            {/* Category */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                defaultValue={item.category}
                {...register("category", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">Dessert</option>
                <option value="drinks">Drinks</option>
                <option value="popular">Popular</option>
                <option value="sale">Sale</option>
              </select>
              {errors.category && <span className="text-red-500">Category is required</span>}
            </div>

            {/* Price */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                defaultValue={item.price}
                {...register("price", { required: true })}
                className="input input-bordered w-full"
                step="any"
              />
              {errors.price && <span className="text-red-500">Price is required</span>}
            </div>
          </div>

          {/* Recipe Details */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details*</span>
            </label>
            <textarea
              defaultValue={item.recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
            ></textarea>
            {errors.recipe && <span className="text-red-500">Recipe details are required</span>}
          </div>

          {/* Image Upload */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Current Image</span>
            </label>
            {imageError ? (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">Image not available</span>
              </div>
            ) : (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-lg mb-2"
                onError={handleImageError}
              />
            )}
            
            <label className="label">
              <span className="label-text">Update Image</span>
            </label>
            <input
              type="file"
              {...register("image")}
              className="file-input w-full max-w-xs"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn bg-green text-white px-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <FaUtensils className="mr-2" />
                  Update Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenu;