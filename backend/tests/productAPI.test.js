const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');

describe('Product API Endpoints', () => {
    // Tests are expecting a mongo database to be running on localhost (GitHub Actions)
    
    beforeAll(async () => {
        // Clear any previous products and insert a dummy
        await Product.deleteMany({});
        await Product.create({
            name: 'Test Product',
            price: 50,
            image: '/test.jpg',
            brand: 'TestBrand',
            category: 'Testing',
            description: 'A test product'
        });
    });

    afterAll(async () => {
        await Product.deleteMany({});
        await mongoose.connection.close();
    });

    it('should fetch all products safely', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
        expect(Array.isArray(res.body.products)).toBe(true);
        expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('should return 404 for magically crafted non-existent product ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/products/${fakeId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Product not found');
    });
});
