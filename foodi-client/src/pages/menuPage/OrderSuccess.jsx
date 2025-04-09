import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaPrint } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">No order details found</h2>
          <Link to="/menu" className="text-blue-600 hover:underline mt-4 block">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Đảm bảo các giá trị số luôn tồn tại
  const items = orderDetails.items || [];
  const totalAmount = Number(orderDetails.totalAmount) || 0;
  const shippingFee = Number(orderDetails.shippingFee) || 0;

  return (
    <div className="min-h-screen flex items-center">
      <div className="max-w-[1200px] w-full mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <div className="bg-white p-8 rounded shadow-sm mb-8">
              <div className="mb-8">
                <img src="/public/logo.png" alt="Foodi Logo" className="h-14" />
              </div>
              
              <div className="flex items-start gap-6 mb-8">
                <FaCheckCircle className="text-[#8EC343] text-4xl mt-1" />
                <div>
                  <h2 className="text-2xl font-medium mb-2">Cảm ơn bạn đã đặt hàng</h2>
                  <p className="text-gray-600 text-lg">
                    Một email xác nhận đã được gửi tới {orderDetails.email}.<br />
                    Xin vui lòng kiểm tra email của bạn
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-medium mb-4 text-lg">Thông tin mua hàng</h3>
                  <div className="text-gray-600 space-y-2">
                    <p>{orderDetails.fullName}</p>
                    <p>{orderDetails.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-lg">Địa chỉ nhận hàng</h3>
                  <div className="text-gray-600 space-y-2">
                    <p>{orderDetails.address}</p>
                    <p>{orderDetails.province}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-lg">Phương thức thanh toán</h3>
                  <p className="text-gray-600">Thanh toán khi giao hàng (COD)</p>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-lg">Phương thức vận chuyển</h3>
                  <p className="text-gray-600">Giao hàng tận nơi</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Link
                to="/menu"
                className="px-8 py-3 bg-green text-white rounded hover:bg-yellow-400 transition-colors text-lg"
              >
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-[450px]">
            <div className="bg-white p-8 rounded shadow-sm">
              <h3 className="font-medium mb-6 text-lg">Đơn hàng ({items.length})</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <span className="absolute -top-2 -right-2 bg-[#2B96CC] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.name}</p>
                    </div>
                    <p className="text-lg">{Number(item.price).toFixed(1)}$</p>
                  </div>
                ))}

                <div className="pt-4 space-y-4">
                  <div className="flex justify-between text-lg">
                    <p>Tạm tính</p>
                    <p>{totalAmount.toFixed(1)}$</p>
                  </div>
                  <div className="flex justify-between text-lg">
                    <p>Phí vận chuyển</p>
                    <p>{shippingFee > 0 ? `${shippingFee.toFixed(1)}$` : 'Chưa tính'}</p>
                  </div>
                  <div className="flex justify-between text-[#2B96CC] font-medium pt-4 border-t text-lg">
                    <p>Tổng cộng</p>
                    <p>{(totalAmount + shippingFee).toFixed(1)}$</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 