import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container animate-fade-in" style={{ minHeight: '80vh', padding: '2rem 1.5rem' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/page/:pageNumber" element={<Home />} />
          <Route path="/search/:keyword/page/:pageNumber" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected: login required */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Protected: admin only (handled inside component) */}
          <Route path="/admin/productlist" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/admin/product/:id/edit" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} E-Commerce Premium. All Rights Reserved.</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
