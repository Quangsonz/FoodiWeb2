import React, { useContext, useEffect, useState, useRef } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import SearchBar from "./SearchBar";
import ServicesDropdown from "./ServicesDropdown";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const {user, loading} = useAuth();
  const [cart, refetch] = useCart();
  const detailsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = [
    { name: "All", path: "/menu" },
    { name: "Salad", path: "/menu/category/salad" },
    { name: "Pizza", path: "/menu/category/pizza" },
    { name: "Soup", path: "/menu/category/soup" },
    { name: "Dessert", path: "/menu/category/dessert" },
    { name: "Drinks", path: "/menu/category/drinks" },
    { name: "Sale", path: "/menu/category/sale" }
  ];

  const navItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li tabIndex={0}>
        <details ref={detailsRef}>
          <summary>Menu</summary>
          <ul className="p-2">
            {categories.map((category, index) => (
              <li key={index}>
                <Link 
                  to={category.path}
                  state={{ category: category.name !== "All" ? category.name.toLowerCase() : "all" }}
                  className="hover:text-green-500"
                  onClick={() => {
                    if (detailsRef.current) {
                      detailsRef.current.open = false;
                    }
                  }}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </li>
      <li>
        <ServicesDropdown />
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
    </>
  );
  return (
    <header
      className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out bg-white`}
    >
      <div
        className={`navbar xl:px-24 ${
          isSticky
            ? "shadow-md bg-white transition-all duration-300 ease-in-out"
            : "bg-white"
        }`}
      >
        <div className="navbar-start">
          <div className="dropdown justify-between">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
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
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64 space-y-3"
            >
              {navItems}
            </ul>
          </div>
          <a href="/">
            <img src={logo} alt="" />
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end">
          <SearchBar />
         
         {/* shopping cart */}
         <Link to="/cart-page">
         <label
            tabIndex={0}
            className="btn btn-ghost btn-circle lg:flex items-center justify-center mr-3"
          >
            <div className="indicator">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="bg-greenbadge badge-sm indicator-item">{cart.length || 0}</span>
            </div>
          </label>
         </Link>

          {/* login button */}
          { 
            user ? <>
           <Profile user={user}/>
          </> : <button onClick={()=>document.getElementById('my_modal_5').showModal()} className="btn flex items-center gap-2 rounded-full px-6 bg-green text-white">
            <FaRegUser /> Login
          </button>
          }
          <Modal/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
