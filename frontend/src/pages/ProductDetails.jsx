import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const addToCart = useStore(state => state.addToCart);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1
            });
            alert('Added to cart!');
        }
    };

    if (loading) return <div>Loading product details...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="animate-fade-in">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                <ArrowLeft size={20} /> Back to Products
            </Link>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} 
                    />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{product.brand} | {product.category}</p>
                    </div>
                    
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                        ${product.price.toFixed(2)}
                    </div>
                    
                    <div style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Description</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}>
                            Status: <span style={{ color: product.countInStock > 0 ? 'var(--secondary-color)' : '#ef4444', fontWeight: 600 }}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} 
                            onClick={handleAddToCart}
                            disabled={product.countInStock === 0}
                        >
                            <ShoppingCart size={20} /> 
                            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
