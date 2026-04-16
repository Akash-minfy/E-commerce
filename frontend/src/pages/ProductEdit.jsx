import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import useStore from '../store/useStore';

const ProductEdit = () => {
    const { id: productId } = useParams();
    const isNew = productId === 'new';
    const navigate = useNavigate();
    const { userInfo } = useStore();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(!isNew);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        // If editing an existing product, fetch its data
        if (!isNew) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${productId}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setBrand(data.brand);
                    setCategory(data.category);
                    setCountInStock(data.countInStock);
                    setDescription(data.description);
                } catch (error) {
                    console.error('Error fetching product', error);
                    alert('Could not load product data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId, isNew, userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const productData = {
            name,
            price: Number(price),
            image,
            brand,
            category,
            countInStock: Number(countInStock),
            description,
        };

        try {
            if (isNew) {
                // Create product directly with all form data in one request
                await axios.post('/api/products', productData, config);
                alert('Product Created Successfully!');
            } else {
                await axios.put(`/api/products/${productId}`, productData, config);
                alert('Product Updated Successfully!');
            }
            navigate('/admin/productlist');
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading editor...</div>;

    return (
        <div className="animate-fade-in">
            <Link to="/admin/productlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                <ArrowLeft size={20} /> Back to List
            </Link>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 700 }}>
                    {isNew ? 'Create New Product' : 'Edit Product'}
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {isNew ? 'Fill all fields below to add a new product to the store.' : 'Modify the details below and save your changes.'}
                </p>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Sony WH-1000XM5"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control"
                                placeholder="e.g. 49.99"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Count In Stock</label>
                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                placeholder="e.g. 10"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            className="form-control"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://cdn.example.com/product-image.jpg"
                            required
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Paste a direct link to your product image (.jpg, .png, .webp).
                        </p>
                        {image && (
                            <img
                                src={image}
                                alt="Preview"
                                onError={(e) => { e.target.style.display = 'none'; }}
                                style={{ marginTop: '0.75rem', height: '120px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '0.5rem' }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Brand</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Sony"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Electronics"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Describe the product's features and highlights..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.05rem' }}
                        disabled={submitting}
                    >
                        {isNew ? <><Plus size={20} /> {submitting ? 'Creating...' : 'Create Product'}</> : <><Save size={20} /> {submitting ? 'Saving...' : 'Update Product'}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
