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
import OderDetailsPage from "./pages/OderDetailsPage";
import Category from "./Admin/adpages/Category";
import AddCategory from "./Admin/adpages/AddCategory";
import { ToastContainer } from 'react-toastify';
import OrderDetailsPage from "./pages/OderDetailsPage";


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
          <Route path="/orderDetails" element={<OderDetailsPage />} />
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

        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;