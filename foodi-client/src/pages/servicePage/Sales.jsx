import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';

const Sales = () => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: menu = [], refetch } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const res = await axiosSecure.get('/menu');
            return res.data;
        }
    });

    useEffect(() => {
        // Filter items that have discount
        const discountedItems = menu.filter(item => item.discount > 0);
        setFilteredItems(discountedItems);
    }, [menu]);

    const handleAddToCart = async (item) => {
        try {
            if (!user) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }

            const token = localStorage.getItem('access-token');
            if (!token) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Vui lòng đăng nhập lại',
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }

            const cartItem = {
                menuItemId: item._id,
                name: item.name,
                quantity: 1,
                image: item.image,
                price: item.price * (1 - item.discount / 100),
                email: user.email,
                recipe: item.recipe || ''
            };

            const { data } = await axiosSecure.post('/carts', cartItem);
            if (data) {
                refetch();
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Thêm vào giỏ hàng thành công!',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Thêm vào giỏ hàng thất bại!',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleProductClick = (id) => {
        navigate(`/menu/item/${id}`);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Sản phẩm giảm giá</h2>
                <p className="text-gray-600">Khám phá các sản phẩm đang được giảm giá hấp dẫn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => handleProductClick(item._id)}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                                -{item.discount}%
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 
                                className="text-xl font-semibold mb-2 cursor-pointer hover:text-green"
                                onClick={() => handleProductClick(item._id)}
                            >
                                {item.name}
                            </h3>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-bold text-red-500">
                                    {(item.price * (1 - item.discount / 100)).toLocaleString()}đ
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                    {item.price.toLocaleString()}đ
                                </span>
                            </div>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className="w-full bg-green text-white py-2 rounded-lg hover:bg-green/90 transition-colors"
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 rounded-lg ${
                            currentPage === index + 1
                                ? 'bg-green text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sales; 