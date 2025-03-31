import axios from 'axios'
import React from 'react'

const axiosPublic = axios.create({
    baseURL: 'http://localhost:8080/api/v1',  // Updated to Spring Boot convention
})

const useAxiosPublic = () => {
    return axiosPublic
}

export default useAxiosPublic;

  