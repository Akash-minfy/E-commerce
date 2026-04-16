import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';

const Home = () => {
    const { keyword, pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products with search and pagination arguments
                const keywordParam = keyword ? `keyword=${keyword}` : '';
                const pageParam = pageNumber ? `pageNumber=${pageNumber}` : '';
                const query = `?${keywordParam}&${pageParam}`;
                const { data } = await axios.get(`/api/products${query}`);
                
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts(data.products || []);
                    setPage(data.page || 1);
                    setPages(data.pages || 1);
                }
            } catch (error) {
                console.warn('API not ready, using mock data');
                // Mock data if backend is not seeded or running
                setProducts([
                    { _id: '1', name: 'Premium Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80', description: 'High quality sound.', brand: 'AudioPro', numReviews: 12, rating: 4.5 },
                    { _id: '2', name: 'Minimalist Smartwatch', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80', description: 'Track your life.', brand: 'TechTime', numReviews: 8, rating: 4.0 },
                    { _id: '3', name: 'Mechanical Keyboard', price: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=80', description: 'Tactile typing.', brand: 'KeyChronos', numReviews: 24, rating: 4.8 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, pageNumber]);

    if (loading) return <div>Loading spectacular products...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 700 }}>Featured Products</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Experience the peak of modern technology.</p>
            <div className="product-grid">
                {products.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)' }}>No products found...</div>
                ) : (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                )}
            </div>
            
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
        </div>
    );
};

export default Home;
