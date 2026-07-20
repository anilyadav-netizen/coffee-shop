import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect, lazy, Suspense } from "react";
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
import SkeletonLoader from "./component/SkeletonLoader";

// User Pages
const Home = lazy(() => import("./pages/Home"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Review = lazy(() => import("./pages/Review"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Journey = lazy(() => import("./pages/Journey"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const UpdateAddress = lazy(() => import("./pages/UpdateAddress"));
const OrderDetailsPage = lazy(() => import("./pages/OderDetailsPage"));

// Admin Pages
const Dashboard = lazy(() => import("./Admin/adpages/Dashboard"));
const Products = lazy(() => import("./Admin/adpages/Products"));
const AddProduct = lazy(() => import("./Admin/adpages/AddProduct"));
const Category = lazy(() => import("./Admin/adpages/Category"));
const AddCategory = lazy(() => import("./Admin/adpages/AddCategory"));
const Orders = lazy(() => import("./Admin/adpages/Orders"));
const AdminProfile = lazy(() => import("./Admin/adLayouts/AdminProfile"));
const Users = lazy(() => import("./Admin/adpages/Users"));
const UserDetails = lazy(() => import("./Admin/adpages/UserDetails"));
const Riders = lazy(() => import("./Admin/adpages/Riders"));
const RiderDetails = lazy(() => import("./Admin/adpages/RiderDetails"));
const DineInOrders = lazy(() => import("./Admin/adpages/DineInOrders"));
const DineInDetails = lazy(() => import("./Admin/adpages/DineInDetails"));
const DeliveryOrders = lazy(() => import("./Admin/adpages/DeliveryOrders"));
const DeliveryDetailsPage = lazy(() => import("./Admin/adpages/DeliveryDetailsPage"));
const TablePage = lazy(() => import("./Admin/adpages/TablePage"));
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const DetailsPage = lazy(() => import("./pages/DetailsPage"));
const JourneyDetailsPage = lazy(() => import("./pages/JourneyDetailsPage"));
const RiderAssignedOrder = lazy(() => import("./Admin/adpages/RiderAssignedOrder"));

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

      <Suspense fallback={<SkeletonLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;