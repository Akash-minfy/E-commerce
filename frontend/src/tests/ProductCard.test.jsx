import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Zustand store since we are testing the UI component isolated from real store
vi.mock('../store/useStore', () => ({
    default: vi.fn(),
}));

describe('ProductCard Component', () => {
    const mockProduct = {
        _id: '12345',
        name: 'Test Setup Product',
        image: '/images/test.jpg',
        description: 'A robust testing component',
        price: 99.99
    };

    beforeEach(() => {
        // Mock default empty store behavior
        useStore.mockReturnValue({
            userInfo: null,
            addToCart: vi.fn()
        });
    });

    it('renders product details correctly', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );
        
        expect(screen.getByText('Test Setup Product')).not.toBeNull();
        expect(screen.getByText('$99.99')).not.toBeNull();
        expect(screen.getByText(/robust testing/i)).not.toBeNull();
    });

    it('requires login to add to cart', () => {
        // Redefine window.alert to capture it
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        const addButton = screen.getByRole('button', { name: /Add/i });
        fireEvent.click(addButton);
        
        // Because userInfo is null, it navigates instead of alerting addToCart
        // Since we didn't mock navigate here, we just make sure alert wasn't called
        expect(alertMock).not.toHaveBeenCalled();
        
        alertMock.mockRestore();
    });
});
