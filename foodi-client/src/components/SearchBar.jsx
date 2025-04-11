import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 0) {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8080/api/v1/menu/search?query=${searchQuery}`);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
                setLoading(false);
            } else {
                setSuggestions([]);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    const handleSuggestionClick = (item) => {
        try {
            if (!item) {
                console.error('Invalid product data:', item);
                return;
            }
            
            // Get the product ID from either id or _id field
            const productId = item._id || item.id;
            
            if (!productId) {
                console.error('Product ID not found:', item);
                return;
            }

            navigate(`/menu/item/${productId}`);
            setIsOpen(false);
            setSearchQuery('');
        } catch (error) {
            console.error('Error navigating to product detail:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Không thể chuyển đến trang chi tiết sản phẩm',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-ghost btn-circle"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </button>

            <dialog id="search_modal" className="modal" open={isOpen}>
                <div className="modal-box w-11/12 max-w-2xl">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm món ăn..."
                            className="input input-bordered w-full"
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary">
                            Tìm
                        </button>
                    </form>

                    {loading && (
                        <div className="flex justify-center my-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    )}

                    {!loading && suggestions.length > 0 && (
                        <div className="mt-4 max-h-96 overflow-y-auto">
                            {suggestions.map((item) => (
                                <div
                                    key={item._id || item.id}
                                    onClick={() => handleSuggestionClick(item)}
                                    className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && searchQuery && suggestions.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            Không tìm thấy kết quả phù hợp
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsOpen(false)}>close</button>
                </form>
            </dialog>
        </>
    );
};

export default SearchBar; 