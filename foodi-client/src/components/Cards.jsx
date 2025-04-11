import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2';
import useCart from "../hooks/useCart";
import axios from 'axios';

const Cards = ({ item }) => {
  console.log("Item received in Cards:", item); // Debug log
  const { name, image, price, recipe, _id, id } = item;
  const itemId = _id || id; // Fallback to id if _id is not available
  console.log("Item ID:", itemId); // Debug log
  
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = () => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: itemId,
        name: name,
        quantity: 1,
        image: image,
        price: price,
        email: user.email,
        recipe: recipe || "",
      };
      
      const token = localStorage.getItem('access-token');
      
      if (!token) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Please login to add items to cart',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/login', { state: { from: location } });
        return;
      }

      axios.post('http://localhost:8080/api/v1/carts', cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.data) {
            refetch();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Food added to the cart.',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: errorMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: 'Please login to order the food',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login now!',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location } });
        }
      });
    }
  };

  const handleProductClick = () => {
    if (!itemId) {
      console.error("No item ID available");
      return;
    }
    console.log("Navigating to product with ID:", itemId); // Debug log
    navigate(`/menu/item/${itemId}`);
  };

  return (
    <div className="card shadow-xl relative mr-5 md:my-5">
      <div
        className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <div onClick={handleProductClick} style={{cursor: 'pointer'}}>
        <figure>
          <img src={image} alt={name} className="hover:scale-105 transition-all duration-300 md:h-72" />
        </figure>
      </div>
      <div className="card-body">
        <div onClick={handleProductClick} style={{cursor: 'pointer'}}>
          <h2 className="card-title">{name}</h2>
        </div>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$ </span> {price}
          </h5>
          <button onClick={handleAddToCart} className="btn bg-green text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;