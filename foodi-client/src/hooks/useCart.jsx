import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const useCart = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('access-token'));
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('access-token');
        setToken(storedToken);
    }, []);

    console.log("useCart - User:", user?.email);
    console.log("useCart - Token exists:", token ? "Yes" : "No");

    const { refetch, data: cart = [], isLoading, error } = useQuery({
        queryKey: ['carts', user?.email],
        queryFn: async () => {
            if (!user?.email) {
                console.log("useCart - No user email, returning empty cart");
                return [];
            }
            if (!token) {
                console.log("useCart - No token found");
                if (!isRedirecting) {
                    setIsRedirecting(true);
                    localStorage.removeItem('access-token');
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Session expired. Please login again.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate('/login');
                }
                throw new Error('No access token found. Please login.');
            }

            console.log(`useCart - Fetching cart for ${user.email}`);
            const res = await fetch(`http://localhost:8080/api/v1/carts?email=${user.email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!res.ok) {
                console.log(`useCart - Error response: ${res.status} - ${res.statusText}`);
                if (res.status === 403 && !isRedirecting) {
                    setIsRedirecting(true);
                    localStorage.removeItem('access-token');
                    setToken(null);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Invalid token or email mismatch. Please login again.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate('/login');
                    throw new Error('Forbidden: Invalid token or email mismatch');
                }
                throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log("useCart - Cart data:", data);
            return data;
        },
        onError: (error) => {
            console.error("Error fetching cart:", error.message);
            if (!isRedirecting) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: error.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        },
        enabled: !!user?.email && !!token && !isRedirecting,
        retry: false,
    });

    return [cart, refetch, isLoading, error];
};

export default useCart;