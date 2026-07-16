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
import DetailsPage from "./pages/DetailsPage";
import JourneyDetailsPage from "./pages/JourneyDetailsPage";
import RiderAssignedOrder from "./Admin/adpages/RiderAssignedOrder";

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
          <Route path="/coffee-journey" element={<JourneyDetailsPage />} />
          <Route path="/product/:id" element={<DetailsPage />} />

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
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard – shared between admin & rider */}
          <Route
            index
            element={
              <RoleRoute allowedRoles={["admin", "rider"]}>
                <Dashboard />
              </RoleRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="orders"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Orders />
              </RoleRoute>
            }
          />
          <Route
            path="products"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Products />
              </RoleRoute>
            }
          />
          <Route
            path="add-product"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AddProduct />
              </RoleRoute>
            }
          />
          <Route
            path="update-product/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AddProduct />
              </RoleRoute>
            }
          />
          <Route
            path="category"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Category />
              </RoleRoute>
            }
          />
          <Route
            path="add-category"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AddCategory />
              </RoleRoute>
            }
          />
          <Route
            path="update-category/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AddCategory />
              </RoleRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Users />
              </RoleRoute>
            }
          />
          <Route
            path="user/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <UserDetails />
              </RoleRoute>
            }
          />
          <Route
            path="update-user/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <UserDetails />
              </RoleRoute>
            }
          />
          <Route
            path="riders"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Riders />
              </RoleRoute>
            }
          />
          <Route
            path="rider/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <RiderDetails />
              </RoleRoute>
            }
          />
          <Route
            path="orders/dine-in"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <DineInOrders />
              </RoleRoute>
            }
          />
          <Route
            path="orders/dine-in/:id"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <DineInDetails />
              </RoleRoute>
            }
          />
          <Route
            path="tables"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <TablePage />
              </RoleRoute>
            }
          />

          {/* Shared routes: Profile, Delivery Orders (admin + rider) */}
          <Route
            path="profile"
            element={
              <RoleRoute allowedRoles={["admin", "rider"]}>
                <AdminProfile />
              </RoleRoute>
            }
          />
          <Route
            path="orders/delivery"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <DeliveryOrders />
              </RoleRoute>
            }
          />
          <Route
            path="orders/delivery/:id"
            element={
              <RoleRoute allowedRoles={["admin", "rider"]}>
                <DeliveryDetailsPage />
              </RoleRoute>
            }
          />

          {/* Rider-only route */}
          <Route
            path="riderassigned"
            element={
              <RoleRoute allowedRoles={["rider"]}>
                <RiderAssignedOrder />
              </RoleRoute>
            }
          />
        </Route>

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;