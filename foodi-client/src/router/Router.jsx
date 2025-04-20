import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/menuPage/Menu";
import Signup from "../components/Signup";
import Order from "../pages/dashboard/Order";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import UserProfile from "../pages/dashboard/UserProfile";
import CartPage from "../pages/menuPage/CartPage";
import Login from "../components/Login";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import ChangePassword from "../pages/dashboard/ChangePassword";
import Contact from "../pages/Contact/Contact";
import ContactMessages from "../pages/dashboard/admin/ContactMessages";
import Checkout from "../pages/menuPage/Checkout";
import OrderSuccess from "../pages/menuPage/OrderSuccess";
import ProductDetail from "../pages/menuPage/ProductDetail";
import AboutUs from "../pages/servicePage/AboutUs";
import OrderTracking from "../pages/servicePage/OrderTracking";
import ManageBookings from "../pages/dashboard/admin/ManageBookings";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/menu",
          element: <Menu/>
        },
        {
          path: "/menu/category/:category",
          element: <Menu/>
        },
        {
          path: "/menu/item/:id",
          element: <ProductDetail/>
        },
        {
          path: "/contact",
          element: <Contact/>
        },
        {
          path: "/about-us",
          element: <AboutUs/>
        },
        {
          path: "/order-tracking",
          element: <OrderTracking/>
        },
        {
          path: "/order",
          element:<PrivateRoute><Order/></PrivateRoute>
        },
        {
          path: "/update-profile",
          element: <PrivateRoute><UserProfile/></PrivateRoute>
        },
        {
          path: "/change-password",
          element: <PrivateRoute><ChangePassword/></PrivateRoute>
        },
        {
          path: "/cart-page",
          element: <CartPage/>
        },
        {
          path: "/checkout",
          element: <PrivateRoute><Checkout/></PrivateRoute>
        },
        {
          path: "/order-success",
          element: <PrivateRoute><OrderSuccess/></PrivateRoute>
        }
      ]
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: 'dashboard',
      element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
      children: [
        {
          path: '',
          element: <Dashboard/>
        },
        {
          path: 'users', 
          element: <Users/>
        },
        {
          path: 'add-menu',
          element: <AddMenu/>
        }, 
        {
          path: "manage-items",
          element: <ManageItems/>
        },
        {
          path: "manage-bookings",
          element: <ManageBookings/>
        },
        {
          path: "update-menu/:id",
          element: <UpdateMenu/>
        },
        {
          path: "contact-messages",
          element: <ContactMessages/>
        }
      ]
    }
  ]);

export default router;