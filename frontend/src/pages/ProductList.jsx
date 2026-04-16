import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash, Plus } from 'lucide-react';
import useStore from '../store/useStore';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useStore();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            // Fetch all products by using a large page size - no pagination limit for admin
            const { data } = await axios.get('/api/products?pageNumber=1&pageSize=1000', {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            });
            setProducts(Array.isArray(data) ? data : data.products);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    const createProductHandler = () => {
        navigate('/admin/product/new/edit');
    };

    if (loading) return <div>Loading management dashboard...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Management: Products</h1>
                <button className="btn btn-primary" onClick={createProductHandler}>
                    <Plus size={20} /> Create Product
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>NAME</th>
                            <th style={{ padding: '1rem' }}>PRICE</th>
                            <th style={{ padding: '1rem' }}>CATEGORY</th>
                            <th style={{ padding: '1rem' }}>BRAND</th>
                            <th style={{ padding: '1rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{product._id}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                <td style={{ padding: '1rem' }}>{product.brand}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/product/${product._id}/edit`} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                            <Edit size={16} />
                                        </Link>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ padding: '0.4rem', color: '#ef4444' }}
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
