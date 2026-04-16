import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const addToCart = useStore(state => state.addToCart);
    const userInfo = useStore(state => state.userInfo);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!userInfo) {
            navigate('/login?redirect=%2Fcart');
            return;
        }
        addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty: 1
        });
        alert('Added to cart!');
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={`/product/${product._id}`}>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
                />
            </Link>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Link to={`/product/${product._id}`}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{product.name}</h3>
                </Link>
                <p style={{ color: 'var(--text-muted)', flexGrow: 1, marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {product.description.substring(0, 60)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                        ${product.price.toFixed(2)}
                    </span>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={handleAddToCart}>
                        <ShoppingCart size={18} /> Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
