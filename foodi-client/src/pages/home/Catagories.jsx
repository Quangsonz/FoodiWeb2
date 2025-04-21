import React, { useEffect, useState } from 'react'
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

const Catagories = () => {
  const [categories, setCategories] = useState([
    {id: 1, title: "Salad", description: "Loading...", image: "/images/home/category/salad.png", path: "salad"},
    {id: 2, title: "Pizza", description: "Loading...", image: "/images/home/category/pizza.png", path: "pizza"},
    {id: 3, title: "Soup", description: "Loading...", image: "/images/home/category/hot-soup.png", path: "soup"},
    {id: 4, title: "Drinks", description: "Loading...", image: "/images/home/category/drink.png", path: "drinks"}
  ]);

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchMenuCounts = async () => {
      try {
        const response = await axiosPublic.get('/menu');
        const menuItems = response.data;
        
        // Count items in each category
        const categoryCounts = {
          salad: menuItems.filter(item => item.category.toLowerCase() === 'salad').length,
          pizza: menuItems.filter(item => item.category.toLowerCase() === 'pizza').length,
          soup: menuItems.filter(item => item.category.toLowerCase() === 'soup').length,
          drinks: menuItems.filter(item => item.category.toLowerCase() === 'drinks').length,
          total: menuItems.length
        };

        // Update categories with real counts
        setCategories([
          {
            id: 1,
            title: "Salad",
            description: `(${categoryCounts.salad} dishes)`,
            image: "/images/home/category/salad.png",
            path: "salad"
          },
          {
            id: 2,
            title: "Pizza",
            description: `(${categoryCounts.pizza} dishes)`,
            image: "/images/home/category/pizza.png",
            path: "pizza"
          },
          {
            id: 3,
            title: "Soup",
            description: `(${categoryCounts.soup} dishes)`,
            image: "/images/home/category/hot-soup.png",
            path: "soup"
          },
          {
            id: 4,
            title: "Drinks",
            description: `(${categoryCounts.drinks} dishes)`,
            image: "/images/home/category/drink.png",
            path: "drinks"
          }
        ]);
      } catch (error) {
        console.error('Error fetching menu counts:', error);
      }
    };

    fetchMenuCounts();
  }, [axiosPublic]);

  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16'>
        <div className='text-center'>
            <p className='subtitle'>Customer Favorites</p>
            <h2 className='title'>Popular Categories</h2>
        </div>

        {/* category cards */}
        <div className='flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12 '>
            {
                categories.map((item) => (
                    <Link 
                        to={`/menu/category/${item.path}`}
                        key={item.id}
                        state={{ category: item.path }}
                    >
                        <div className='shadow-lg rounded-md bg-white py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 transition-all duration-300 z-10'>
                            <div className='w-full mx-auto flex items-center justify-center'>
                                <img src={item.image} alt={item.title} className='bg-[#C1F1C6] p-5 rounded-full w-28 h-28' />
                            </div>
                            <div className='mt-5 space-y-1'>
                                <h5 className='text-[#1E1E1E] font-semibold'>{item.title}</h5>
                                <p className='text-secondary text-sm'>{item.description}</p>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default Catagories