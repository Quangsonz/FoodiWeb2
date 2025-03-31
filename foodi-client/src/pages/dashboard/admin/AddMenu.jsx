import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from 'sweetalert2'

const AddMenu = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    try {
      // Upload image
      const imageFile = { image: data.image[0] };
      const hostingImg = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (hostingImg.data.success) {
        const menuItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price), 
          recipe: data.recipe,
          image: hostingImg.data.data.display_url
        };

        // Add menu item
        const response = await axiosSecure.post('/api/v1/menu', menuItem);
        if(response.data) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Menu item added successfully!",
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong while adding the menu item!",
      });
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Upload A New <span className="text-green">Menu Item</span>
      </h2>

      {/* form here */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Recipe name is required" })}
              placeholder="Recipe Name"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
          </div>

          {/* 2nd row */}
          <div className="flex items-center gap-4">
            {/* categories */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`select select-bordered ${errors.category ? 'select-error' : ''}`}
                defaultValue="default"
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">Dessert</option>
                <option value="drinks">Drinks</option>
                <option value="popular">Popular</option>
              </select>
              {errors.category && <span className="text-red-500 text-sm mt-1">{errors.category.message}</span>}
            </div>

            {/* prices */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
                placeholder="Price"
                className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
              />
              {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price.message}</span>}
            </div>
          </div>

          {/* 3rd row */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details*</span>
            </label>
            <textarea
              {...register("recipe", { required: "Recipe details are required" })}
              className={`textarea textarea-bordered h-24 ${errors.recipe ? 'textarea-error' : ''}`}
              placeholder="Tell the world about your recipe"
            ></textarea>
            {errors.recipe && <span className="text-red-500 text-sm mt-1">{errors.recipe.message}</span>}
          </div>

          {/* 4th row */}
          <div className="form-control w-full my-6">
            <input
              {...register("image", { 
                required: "Image is required",
                validate: {
                  lessThan10MB: files => !files[0] || files[0].size <= 10485760 || 'Image must be less than 10MB',
                  acceptedFormats: files =>
                    !files[0] || ['image/jpeg', 'image/png', 'image/gif'].includes(files[0].type) || 'Only JPEG, PNG and GIF images are allowed'
                }
              })}
              type="file"
              className={`file-input w-full max-w-xs ${errors.image ? 'file-input-error' : ''}`}
              accept="image/*"
            />
            {errors.image && <span className="text-red-500 text-sm mt-1">{errors.image.message}</span>}
          </div>

          <button type="submit" className="btn bg-green text-white px-6">
            Add Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
