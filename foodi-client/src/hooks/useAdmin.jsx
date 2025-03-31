import React from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { refetch, data: isAdmin, isPending: isAdminLoading} = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !!user?.email,  // Only run query if user email exists
        queryFn: async () => {
           const res = await axiosSecure.get(`/api/v1/users/admin/${user?.email}`)
           console.log("API Response:", res)
           console.log("User email:", user?.email)
           console.log("Is Admin:", res.data)
            return res.data;  // Backend returns boolean
        }
    })
  
    return [isAdmin, isAdminLoading]
}

export default useAdmin;