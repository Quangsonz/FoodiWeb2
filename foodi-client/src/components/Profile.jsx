import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import avatarImg from "/images/avatar.jpg"
import logo from "/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUtensils, FaCog, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Profile = ({ user }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate()

  // logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate("/")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user.photoURL? <img alt="" src={user.photoURL} /> : <img alt="" src={avatarImg} />}
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-gradient-to-b from-base-100 to-base-200 text-base-content backdrop-blur-md">
            {/* Header with Logo */}
            <div className="flex items-center justify-center mb-8 border-b border-opacity-20 pb-4">
              <img src={logo} alt="Foodi Logo" className="w-32 hover:scale-105 transition-transform duration-300" />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 px-2 animate-fadeIn">
              <div className="avatar">
                <div className="w-14 rounded-full ring ring-green-500 ring-offset-base-100 ring-offset-2 hover:ring-primary transition-all duration-300">
                  {user.photoURL? <img alt="" src={user.photoURL} className="hover:scale-105 transition-transform duration-300" /> 
                               : <img alt="" src={avatarImg} className="hover:scale-105 transition-transform duration-300" />}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-500">{user.displayName || 'User'}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <ul className="space-y-2">
              <li>
                <Link to="/update-profile" 
                  className="flex items-center gap-3 hover:bg-green-50 hover:text-green-600 rounded-lg p-3 transition-all duration-300 group">
                  <FaUser className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/menu" 
                  className="flex items-center gap-3 hover:bg-green-50 hover:text-green-600 rounded-lg p-3 transition-all duration-300 group">
                  <FaUtensils className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Menu</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" 
                  className="flex items-center gap-3 hover:bg-green-50 hover:text-green-600 rounded-lg p-3 transition-all duration-300 group">
                  <FaCog className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" 
                  className="flex items-center gap-3 hover:bg-green-50 hover:text-green-600 rounded-lg p-3 transition-all duration-300 group">
                  <FaTachometerAlt className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>

            {/* Logout Button */}
            <div className="mt-auto">
              {/* Social Icons */}
              <div className="flex justify-center gap-6 mb-6 pt-4 border-t border-opacity-20">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="text-green-500 hover:text-green-600 transition-all duration-300 hover:scale-125">
                  <FaFacebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="text-green-500 hover:text-green-600 transition-all duration-300 hover:scale-125">
                  <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="text-green-500 hover:text-green-600 transition-all duration-300 hover:scale-125">
                  <FaInstagram size={24} />
                </a>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 justify-center bg-white text-black hover:bg-black hover:text-white border-2 border-black py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg group font-semibold"
              >
                <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
