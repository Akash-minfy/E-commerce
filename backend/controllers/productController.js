const Product = require('../models/Product');

// Fetch all products
const getProducts = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 4;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i',
              },
          }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// Fetch single product
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// Create a product directly with provided data
const createProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    // Validate all required fields are present
    if (!name || !image || !description || !brand || !category) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = new Product({
        name,
        price: Number(price) || 0,
        image,
        brand,
        category,
        countInStock: Number(countInStock) || 0,
        numReviews: 0,
        description,
        rating: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// Update product data
const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
