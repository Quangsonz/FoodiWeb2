import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [cart, refetchCart] = useCart();
  const navigate = useNavigate();
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart-page", { replace: true });
    }
  }, [cart, navigate]);

  const [shippingInfo, setShippingInfo] = useState({
    email: user?.email || "",
    fullName: user?.displayName || "",
    phone: "",
    address: "",
    province: "",
    district: "",
    note: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Tính phí vận chuyển dựa trên tỉnh thành
  const getShippingFee = () => {
    switch (shippingInfo.province) {
      case "hanoi":
        return 1.5;
      case "hochiminh":
        return 3;
      default:
        return 0;
    }
  };

  // Tính tổng tiền hàng
  const cartSubtotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Tính tổng tiền bao gồm phí ship
  const shippingFee = getShippingFee();
  const orderTotal = cartSubtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate thông tin
      if (!shippingInfo.email || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
        throw new Error("Vui lòng điền đầy đủ thông tin giao hàng!");
      }

      const orderData = {
        userId: user?.email,
        customerName: shippingInfo.fullName,
        items: cart.map(item => ({
          menuId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: orderTotal,
        status: "pending",
        createdAt: new Date(),
        address: `${shippingInfo.address}, ${shippingInfo.district}, ${shippingInfo.province}`,
        phone: shippingInfo.phone
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );

      if (response.data) {
        // Clear cart after successful order
        localStorage.removeItem("cart");
        refetchCart();
        
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đặt hàng thành công!",
          text: "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ sớm nhất!",
          showConfirmButton: true,
        }).then(() => {
          // Chuyển đến trang xác nhận đơn hàng
          navigate("/order-success", {
            state: {
              orderDetails: {
                orderId: response.data.id || "67f69d0ee78d50463d2c0dae",
                email: shippingInfo.email,
                fullName: shippingInfo.fullName,
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                district: shippingInfo.district,
                province: shippingInfo.province,
                note: shippingInfo.note,
                totalAmount: cartSubtotal,
                shippingFee: shippingFee,
                items: cart.map(item => ({
                  name: item.name,
                  price: parseFloat(item.price),
                  quantity: item.quantity,
                  image: item.image
                }))
              }
            }
          });
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Lỗi!",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* Header with proper spacing */}
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Thanh Toán <span className="text-green">Đơn Hàng</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 py-8">
        {/* Left Section */}
        <div className="lg:w-2/3">
          {/* Thông tin nhận hàng */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Thông tin nhận hàng</h2>
              {!user && <Link to="/login" className="text-blue-600">Đăng nhập</Link>}
            </div>

            <form id="checkout-form" className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-3 border rounded-md"
                required
              />

              <input
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                placeholder="Họ và tên"
                className="w-full p-3 border rounded-md"
                required
              />

              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="w-full p-3 border rounded-md pr-20"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  <img src="/images/vn-flag.png" alt="VN" className="w-6 h-4" />
                </div>
              </div>

              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="Địa chỉ"
                className="w-full p-3 border rounded-md"
                required
              />

              <select
                name="province"
                value={shippingInfo.province}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md bg-white"
                required
              >
                <option value="">Tỉnh thành</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hochiminh">TP. Hồ Chí Minh</option>
              </select>

              <select
                name="district"
                value={shippingInfo.district}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md bg-white"
                required
              >
                <option value="">Quận huyện</option>
                {shippingInfo.province === "hanoi" && (
                  <>
                    <option value="ba-dinh">Ba Đình</option>
                    <option value="hoan-kiem">Hoàn Kiếm</option>
                    <option value="hai-ba-trung">Hai Bà Trưng</option>
                    <option value="dong-da">Đống Đa</option>
                  </>
                )}
                {shippingInfo.province === "hochiminh" && (
                  <>
                    <option value="quan-1">Quận 1</option>
                    <option value="quan-2">Quận 2</option>
                    <option value="quan-3">Quận 3</option>
                    <option value="quan-4">Quận 4</option>
                  </>
                )}
              </select>

              <textarea
                name="note"
                value={shippingInfo.note}
                onChange={handleInputChange}
                placeholder="Ghi chú (tùy chọn)"
                className="w-full p-3 border rounded-md h-24"
              />
            </form>
          </div>

          {/* Vận chuyển */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Vận chuyển</h2>
            <div className="p-4 bg-blue-50 rounded-md">
              {!shippingInfo.province ? (
                <p className="text-gray-600">Phí vận chuyển</p>
              ) : (
                <p className="text-gray-600">
                  Phí vận chuyển: {shippingFee.toLocaleString()}$ 
                  {shippingInfo.province === "hanoi" ? "" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Thanh toán */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
            <div className="border rounded-md p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  defaultChecked
                  className="form-radio"
                />
                <span>Thanh toán khi giao hàng (COD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Đơn hàng</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id || item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-green text-white rounded-full text-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.price.toLocaleString()}$
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 p-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                Áp dụng
              </button>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{cartSubtotal.toLocaleString()}$</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()}$` : 'Chưa tính'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-red">{orderTotal.toLocaleString()}$</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Link to="/cart-page" className="text-green hover:underline block">
                ← Quay về giỏ hàng
              </Link>
              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full py-3 bg-green text-white rounded-md hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 