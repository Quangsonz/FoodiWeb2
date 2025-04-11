import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthProvider';
import Swal from 'sweetalert2';
import useCart from '../../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get all menu items first
        const response = await axiosPublic.get('/menu');
        // Find the specific item by id, handling both string and number comparisons
        const foundProduct = response.data.find(item => 
          String(item._id) === String(id) || 
          String(item.id) === String(id)
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error('Product not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
        // Show error message to user
        Swal.fire({
          icon: 'error',
          title: 'Product not found',
          text: 'The requested product could not be found.',
          confirmButtonText: 'Return to Menu',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/menu');
          }
        });
      }
    };

    fetchProduct();
  }, [id, axiosPublic, navigate]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    if (user && user.email) {
      // Debug log to check product data
      console.log("Product data:", product);
      
      // Use either _id or id, whichever is available
      const productId = product._id || product.id;
      
      if (!product || !productId) {
        console.error("Invalid product data:", product);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Invalid product data',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Convert price and quantity to appropriate types
      const cartItem = {
        menuItemId: productId.toString(), // Use the determined ID
        name: product.name,
        quantity: parseInt(quantity),
        image: product.image,
        price: parseFloat(product.price),
        email: user.email,
        recipe: product.recipe || ""
      };
      
      console.log("Sending cart item:", cartItem); // Debug log
      
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

      // Check if item already exists in cart
      const existingCartItem = cart.find(item => 
        item.menuItemId === productId || 
        item.menuItemId === productId.toString()
      );
      
      if (existingCartItem) {
        // Update quantity if item exists
        const updatedQuantity = existingCartItem.quantity + parseInt(quantity);
        axiosSecure.patch(`/api/v1/carts/${existingCartItem._id}`, {
          quantity: updatedQuantity,
          menuItemId: productId.toString() // Use the determined ID
        })
        .then((response) => {
          console.log("Update response:", response.data); // Debug log
          if (response.data) {
            refetch();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cart updated successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
          console.log("Error response data:", error.response?.data); // Debug log
          const errorMessage = error.response?.data?.message || 'Failed to update cart';
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: errorMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        // Add new item
        axiosSecure.post('/api/v1/carts', cartItem)
          .then((response) => {
            console.log("Server response:", response.data); // Debug log
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
            console.log("Error details:", error.response?.data); // Debug log
            const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: errorMessage,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <button 
            onClick={() => navigate('/menu')}
            className="btn bg-green text-white"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const oldPrice = product.price * 1.2; // Giá cũ cao hơn 20%

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 my-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image Section */}
        <div className="md:w-1/2">
          <div className="sticky top-20">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-[400px] rounded-2xl object-cover shadow-lg"
            />
            <div className="flex gap-4 mt-6 justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-20 h-20 rounded-lg object-cover cursor-pointer border-2 border-green hover:border-red-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-red-500">
                {product.price.toLocaleString()}đ
              </span>
              <span className="text-xl text-gray-400 line-through">
                {oldPrice.toLocaleString()}đ
              </span>
            </div>
          </div>

          {/* Status and Product Code */}
          <div className="space-y-4 border-b pb-6">
            <div className="flex items-center gap-8">
              <p className="text-gray-600">
                Tình trạng: <span className="text-green-500 font-medium">Còn hàng</span>
              </p>
              <p className="text-gray-600">
                Mã SP: <span className="font-medium">#{product._id?.slice(-6)}</span>
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 border-b pb-6">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-600">
                Xuất xứ: <span className="font-medium">Việt Nam</span>
              </p>
              <p className="text-gray-600">
                Khối lượng: <span className="font-medium">1.0Kg/ hộp</span>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">{product.recipe}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6">
              <span className="text-gray-700 font-medium">Số lượng:</span>
              <div className="flex items-center border-2 rounded-lg">
                <button 
                  onClick={handleDecrease}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 border-x-2 font-medium">{quantity}</span>
                <button 
                  onClick={handleIncrease}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 bg-green text-white rounded-xl hover:bg-red-600 transition-colors font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          {/* Share Section */}
          <div className="pt-6 border-t">
            <p className="text-gray-700 font-medium mb-3">Chia sẻ sản phẩm:</p>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.443 5.35c.639 0 1.23.05 1.77.198.541.099.984.297 1.377.495.394.198.689.495.885.791.197.297.296.693.296 1.089 0 .396-.099.791-.296 1.188-.197.297-.492.594-.885.791.591.198 1.033.495 1.328.891.296.396.443.891.443 1.486 0 .396-.098.791-.295 1.188-.197.396-.492.693-.885.99-.394.198-.886.396-1.476.495-.591.099-1.279.198-2.066.198H1.431V5.35h6.012zm-.689 4.257c.492 0 .885-.099 1.18-.198.295-.198.394-.495.394-.891 0-.198-.049-.396-.147-.495-.098-.099-.246-.198-.394-.297-.147-.099-.344-.099-.59-.099H4.22v1.98h2.534zm.197 4.455c.541 0 .984-.099 1.279-.297.295-.198.443-.495.443-.891 0-.396-.148-.693-.443-.891-.295-.198-.738-.297-1.279-.297H4.22v2.376h2.731zM13.405 5.35h3.212l2.969 4.752 2.919-4.752h3.163L20.431 12l5.286 6.698h-3.212l-2.969-4.752-2.919 4.752h-3.163l5.286-6.648L13.405 5.35z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 