import React, { useContext, useState } from "react";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const [localCart, setLocalCart] = useState(cart);
  const token = localStorage.getItem('access-token');

  // Cập nhật localCart khi cart thay đổi
  React.useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  const handleIncrease = async (item) => {
    // Cập nhật UI ngay lập tức
    const updatedCart = localCart.map(cartItem => 
      cartItem.id === item.id 
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setLocalCart(updatedCart);

    try {
      await axios.put(
        `http://localhost:8080/api/v1/carts/${item.id}`,
        {
          quantity: item.quantity + 1,
          email: user.email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      // Nếu lỗi, rollback lại state cũ
      setLocalCart(cart);
      console.error("Error updating quantity:", error.response?.data || error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: error.response?.data?.message || 'Failed to update quantity',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      // Cập nhật UI ngay lập tức
      const updatedCart = localCart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setLocalCart(updatedCart);

      try {
        await axios.put(
          `http://localhost:8080/api/v1/carts/${item.id}`,
          {
            quantity: item.quantity - 1,
            email: user.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        // Nếu lỗi, rollback lại state cũ
        setLocalCart(cart);
        console.error("Error updating quantity:", error.response?.data || error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.response?.data?.message || 'Failed to update quantity',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const cartSubtotal = localCart.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  const orderTotal = cartSubtotal;

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Cập nhật UI ngay lập tức
        const updatedCart = localCart.filter(cartItem => cartItem.id !== item.id);
        setLocalCart(updatedCart);

        axios.delete(
          `http://localhost:8080/api/v1/carts/${item.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
          .then((response) => {
            refetch();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Item deleted successfully',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            // Nếu lỗi, rollback lại state cũ
            setLocalCart(cart);
            console.error("Error deleting item:", error.response?.data || error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: error.response?.data?.message || 'Failed to delete item',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Items Added to The <span className="text-green">Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {localCart.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {localCart.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={item.image} alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <button className="btn btn-xs" onClick={() => handleDecrease(item)}>
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-10 mx-2 text-center overflow-hidden appearance-none"
                      />
                      <button className="btn btn-xs" onClick={() => handleIncrease(item)}>
                        +
                      </button>
                    </td>
                    <td>${calculateTotalPrice(item).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm border-none text-red bg-transparent"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <p>Name: {user?.displayName || "None"}</p>
              <p>Email: {user?.email}</p>
              <p>
                User_id: <span className="text-sm">{user?.uid}</span>
              </p>
            </div>
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Shopping Details</h3>
              <p>Total Items: {localCart.length}</p>
              <p>
                Total Price: <span id="total-price">${orderTotal.toFixed(2)}</span>
              </p>
              <Link to="/checkout">
                <button className="btn btn-md bg-green text-white px-8 py-1">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Cart is empty. Please add products.</p>
          <Link to="/menu">
            <button className="btn bg-green text-white mt-3">Back to Menu</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;