import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package } from 'lucide-react';
import useStore from '../store/useStore';
import SearchBox from './SearchBox';

const Navbar = () => {
    const { userInfo, logout, cartItems } = useStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="brand">
                    Akash E-commerce
                </Link>
                <div style={{ flexGrow: 1, padding: '0 2rem', display: 'flex', justifyContent: 'center' }}>
                    <SearchBox />
                </div>
                <div className="nav-links">
                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                        {cartItems.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-15px',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 16px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </Link>
                    {userInfo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Hi, {userInfo.name}</span>

                            {userInfo.isAdmin && (
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                                    <Link to="/admin/productlist" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', fontWeight: 600 }}>
                                        <Package size={18} /> Admin
                                    </Link>
                                </div>
                            )}

                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                            <UserIcon size={16} /> Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
