import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import { ShoppingBag, MapPin, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';

// Step indicator component
const StepIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Shipping', icon: <MapPin size={16} /> },
        { num: 2, label: 'Review', icon: <ShoppingBag size={16} /> },
        { num: 3, label: 'Payment', icon: <CreditCard size={16} /> },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
            {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: currentStep >= step.num
                                ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))'
                                : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${currentStep >= step.num ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            color: currentStep >= step.num ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.3s ease',
                            boxShadow: currentStep >= step.num ? '0 0 15px rgba(99,102,241,0.4)' : 'none',
                        }}>
                            {step.icon}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: currentStep >= step.num ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: currentStep >= step.num ? 600 : 400 }}>
                            {step.label}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div style={{
                            height: '2px', width: '80px', marginBottom: '1.5rem',
                            background: currentStep > step.num ? 'var(--primary-color)' : 'var(--border-color)',
                            transition: 'background 0.3s ease',
                        }} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const Checkout = () => {
    const { cartItems, clearCart, userInfo } = useStore();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);
    const orderCompletedRef = React.useRef(false); // Ref bypasses React's render batching

    // Shipping fields
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    // Price calculations
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 10.00;
    const taxPrice = parseFloat((0.15 * itemsPrice).toFixed(2));
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    useEffect(() => {
        if (!userInfo) navigate('/login?redirect=%2Fcheckout');
        // Only redirect if cart is empty AND order has NOT been completed yet
        if (cartItems.length === 0 && !orderCompletedRef.current) navigate('/cart');
    }, [userInfo, cartItems, navigate]);

    const submitShipping = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.product,
                })),
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'Standard Mock Payment',
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }, config);

            // Set the ref FIRST — this prevents the useEffect from redirecting
            // when clearCart() empties cartItems synchronously below
            orderCompletedRef.current = true;

            setPlacedOrder(data);
            clearCart();
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '750px', margin: '0 auto' }} className="animate-fade-in">
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 700 }}>Checkout</h1>
            <StepIndicator currentStep={step} />

            {/* ── STEP 1: Shipping ── */}
            {step === 1 && (
                <div className="card" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={22} style={{ color: 'var(--primary-color)' }} /> Shipping Address
                    </h2>
                    <form onSubmit={submitShipping}>
                        <div className="form-group">
                            <label>Street Address</label>
                            <input
                                type="text" className="form-control"
                                placeholder="123 Main Street, Apt 4B"
                                value={address} onChange={(e) => setAddress(e.target.value)} required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" className="form-control" placeholder="New York"
                                    value={city} onChange={(e) => setCity(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input type="text" className="form-control" placeholder="10001"
                                    value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" className="form-control" placeholder="United States"
                                value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                            Continue to Review <ChevronRight size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* ── STEP 2: Review & Place Order ── */}
            {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Shipping summary */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} style={{ color: 'var(--primary-color)' }} /> Shipping To
                            </h3>
                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setStep(1)}>
                                Edit
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{address}, {city}, {postalCode}, {country}</p>
                    </div>

                    {/* Order items */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingBag size={18} style={{ color: 'var(--primary-color)' }} /> Order Items
                        </h3>
                        {cartItems.map(item => (
                            <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <span style={{ flexGrow: 1, fontWeight: 500 }}>{item.name}</span>
                                <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {item.qty} × ${item.price.toFixed(2)} = <strong style={{ color: 'var(--text-main)' }}>${(item.qty * item.price).toFixed(2)}</strong>
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={18} style={{ color: 'var(--primary-color)' }} /> Price Summary
                        </h3>
                        {[
                            { label: 'Items', value: `$${itemsPrice.toFixed(2)}` },
                            { label: `Shipping ${itemsPrice > 500 ? '(Free over $500)' : ''}`, value: shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}` },
                            { label: 'Tax (15%)', value: `$${taxPrice.toFixed(2)}` },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>{row.label}</span><span>{row.value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '1.4rem', fontWeight: 700 }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary-color)' }}>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1.1rem' }}
                            onClick={placeOrderHandler}
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : '✓ Place Order & Pay'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Confirmation ── */}
            {step === 3 && placedOrder && (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle size={80} style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Placed!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Your order has been saved to our database. You will receive it soon.
                    </p>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{placedOrder._id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Paid</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>${placedOrder.totalPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Shipping To</span>
                            <span>{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.country}</span>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
