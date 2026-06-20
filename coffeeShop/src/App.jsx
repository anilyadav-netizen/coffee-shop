import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Review from './pages/Review';
import Gallery from './pages/Gallery';
import Journey from './pages/Journey';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Footer from './component/Footer';
import Navbar from './component/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './component/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        {/* Menu Route with Category ID */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:categoryId" element={<MenuPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/review" element={<Review />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;