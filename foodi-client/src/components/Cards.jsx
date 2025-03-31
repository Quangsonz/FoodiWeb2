import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2';
import useCart from "../hooks/useCart";
import axios from 'axios';

const Cards = ({ item }) => {
  const { name, image, price, recipe, _id, id } = item;
  console.log("Item received:", item);
  console.log("_id value:", _id);
  console.log("id value:", id);
  
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
        menuItemId: id || _id,
        name: name,
        quantity: 1,
        image: image,
        price: price,
        email: user.email,
        recipe: recipe || "",
      };
      console.log("Cart item being sent:", cartItem);
  
      const token = localStorage.getItem('access-token');
      console.log("Token from localStorage:", token ? "Token exists" : "Token missing", token ? token.substring(0, 20) + "..." : "");
      
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
          console.error("Error response:", error.response);
          console.error("Error details:", error.response?.data);
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
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img src={item.image} alt="Shoes" className="hover:scale-105 transition-all duration-300 md:h-72" />
        </figure>
      </Link>
      <div className="card-body">
        <Link to={`/menu/${item._id}`}>
          <h2 className="card-title">{item.name}!</h2>
        </Link>
        <p>{recipe || "Description of the item"}</p>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            <span className="text-sm text-red">$ </span> {item.price}
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