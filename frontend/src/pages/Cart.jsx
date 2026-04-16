import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Trash2 } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, userInfo } = useStore();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        // User is guaranteed to be logged in here (ProtectedRoute guards this page),
        // but double-check just in case.
        if (!userInfo) {
            navigate('/login?redirect=%2Fcart');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
                    <h2>Your cart is empty</h2>
                    <br />
                    <Link to="/" className="btn btn-primary">Go Back Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.product} className="card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', marginBottom: '1rem', gap: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                <div style={{ flexGrow: 1 }}>
                                    {/* Fixed: links to product detail page, not just home */}
                                    <Link to={`/product/${item.product}`} style={{ fontSize: '1.2rem', fontWeight: 600 }}>{item.name}</Link>
                                    <h3 style={{ color: 'var(--primary-color)', marginTop: '0.5rem' }}>${item.price.toFixed(2)}</h3>
                                </div>
                                <button className="btn btn-secondary" onClick={() => removeFromCart(item.product)}>
                                    <Trash2 size={20} color="#ef4444" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                            <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={checkoutHandler}>
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
