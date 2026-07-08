import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

import { getProfile } from "./redux/Slicer/authSlice";

// Layouts
import UserLayouts from "./Layouts/UserLayouts";
import AdminLayout from "./Admin/adLayouts/AdminLayout";

// Components
import ScrollToTop from "./component/ScrollToTop";
import PrivateRoute from "./component/PrivateRoute";
import RoleRoute from "./component/RoleRoute";

// User Pages
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Review from "./pages/Review";
import Gallery from "./pages/Gallery";
import Journey from "./pages/Journey";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import UpdateAddress from "./pages/UpdateAddress";
import OrderDetailsPage from "./pages/OderDetailsPage";

// Admin Pages
import Dashboard from "./Admin/adpages/Dashboard";
import Products from "./Admin/adpages/Products";
import AddProduct from "./Admin/adpages/AddProduct";
import Category from "./Admin/adpages/Category";
import AddCategory from "./Admin/adpages/AddCategory";
import Orders from "./Admin/adpages/Orders";
import AdminProfile from "./Admin/adLayouts/AdminProfile";
import Users from "./Admin/adpages/Users";
import UserDetails from "./Admin/adpages/UserDetails";
import Riders from "./Admin/adpages/Riders";
import RiderDetails from "./Admin/adpages/RiderDetails";
import DineInOrders from "./Admin/adpages/DineInOrders";
import DineInDetails from "./Admin/adpages/DineInDetails";
import DeliveryOrders from "./Admin/adpages/DeliveryOrders";
import DeliveryDetailsPage from "./Admin/adpages/DeliveryDetailsPage";
import TablePage from "./Admin/adpages/TablePage";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function App() {

  const dispatch = useDispatch();
  const { token, authChecked, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !authChecked) {
      dispatch(getProfile());
    }
  }, [dispatch, token, authChecked]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />

      <Routes>

        {/* ================= USER ================= */}
        <Route element={<UserLayouts />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="menu/:categoryId" element={<MenuPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="journey" element={<Journey />} />
          <Route path="review" element={<Review />} />
          <Route path="orderDetails" element={<OrderDetailsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="address/new" element={<UpdateAddress />} />
          <Route path="address/:addressId" element={<UpdateAddress />} />

          <Route
            path="cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin", "rider"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route
            index
            element={
              user?.role === "rider" ? (
                <Navigate to="/admin/orders/delivery" replace />
              ) : (
                <Dashboard />
              )
            }
          />

          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="update-product/:id" element={<AddProduct />} />

          <Route path="category" element={<Category />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="update-category/:id" element={<AddCategory />} />

          <Route path="orders" element={<Orders />} />

          <Route path="profile" element={<AdminProfile />} />

          <Route path="users" element={<Users />} />
          <Route path="user/:id" element={<UserDetails />} />
          <Route path="update-user/:id" element={<UserDetails />} />

          <Route path="riders" element={<Riders />} />
          <Route path="rider/:id" element={<RiderDetails />} />

          <Route path="orders/dine-in" element={<DineInOrders />} />
          <Route path="orders/dine-in/:id" element={<DineInDetails />} />

          <Route path="orders/delivery" element={<DeliveryOrders />} />
          <Route
            path="orders/delivery/:id"
            element={<DeliveryDetailsPage />}
          />

          <Route path="tables" element={<TablePage />} />
        </Route>

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;