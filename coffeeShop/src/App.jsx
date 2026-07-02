import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
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

import ScrollToTop from "./component/ScrollToTop";
import PrivateRoute from "./component/PrivateRoute";

// Layout
import UserLayouts from "./Layouts/UserLayouts";
import AdminLayout from "./Admin/adLayouts/AdminLayout";
import Dashboard from "./Admin/adpages/Dashboard";
import Products from "./Admin/adpages/Products";
import AddProduct from "./Admin/adpages/AddProduct";
import Category from "./Admin/adpages/Category";
import AddCategory from "./Admin/adpages/AddCategory";
import { ToastContainer } from 'react-toastify';
import OrderDetailsPage from "./pages/OderDetailsPage";
import Orders from "./Admin/adpages/Orders";
import AdminProfile from "./Admin/adLayouts/AdminProfile";
import Users from "./Admin/adpages/Users";
import UserDetails from "./Admin/adpages/UserDetails";
import Riders from "./Admin/adpages/Riders";
import RiderDetails from "./Admin/adpages/RiderDetails";
import DineInOrders from "./Admin/adpages/DineInOrders";
import DeliveryOrders from "./Admin/adpages/DeliveryOrders";
import DineInDetails from "./Admin/adpages/DineInDetails";
import DeliveryDetailsPage from "./Admin/adpages/DeliveryDetailsPage";
import TablePage from "./Admin/adpages/TablePage";

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />

      <ToastContainer />
      <Routes>
        {/* User Layout */}
        <Route element={<UserLayouts />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:categoryId" element={<MenuPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/review" element={<Review />} />
          <Route path="/orderDetails" element={<OrderDetailsPage />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="/admin/update-product/:id" element={<AddProduct />} /> {/* ✅ Same component */}
          <Route path="/admin/update-category/:id" element={<AddCategory />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/user/:id" element={<UserDetails />} />
          <Route path="/admin/update-user/:id" element={<UserDetails />} />
          <Route path="/admin/riders" element={<Riders />} />
          <Route path="/admin/orders/dine-in" element={<DineInOrders />} />
          <Route path="/admin/orders/dine-in/:id" element={<DineInDetails />} />
          <Route path="/admin/orders/delivery" element={<DeliveryOrders />} />
          <Route path="/admin/orders/delivery/:id" element={<DeliveryDetailsPage />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="/admin/tables" element={<TablePage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;