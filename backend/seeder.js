const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
    {
        name: 'Airpods Wireless Bluetooth Headphones',
        image: 'https://brain-images-ssl.cdn.dixons.com/6/2/10207226/u_10207226.jpg',
        description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.',
        brand: 'Apple',
        category: 'Electronics',
        price: 89.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'iPhone 13 Pro 256GB Memory',
        image: 'https://m.media-amazon.com/images/I/61l9ppRIiqL._SL1500_.jpg',
        description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity.',
        brand: 'Apple',
        category: 'Electronics',
        price: 999.99,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
    },
    {
        name: 'Cannon EOS 80D DSLR Camera',
        image: 'https://www.bhphotovideo.com/images/images2500x2500/canon_1263c005_eos_80d_dslr_camera_1225876.jpg',
        description: 'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design.',
        brand: 'Cannon',
        category: 'Electronics',
        price: 929.99,
        countInStock: 5,
        rating: 3,
        numReviews: 12,
    },
    {
        name: 'Sony Playstation 5',
        image: 'https://tse4.mm.bing.net/th/id/OIP.YpTHqDYR3IPHmb3nX10kQgHaDo?w=346&h=171&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        description: 'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music.',
        brand: 'Sony',
        category: 'Electronics',
        price: 499.99,
        countInStock: 11,
        rating: 5,
        numReviews: 12,
    },
    {
        name: 'Logitech G-Series Gaming Mouse',
        image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
        description: 'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse.',
        brand: 'Logitech',
        category: 'Electronics',
        price: 49.99,
        countInStock: 7,
        rating: 3.5,
        numReviews: 10,
    },
    {
        name: 'Amazon Echo Dot 3rd Gen',
        image: 'https://m.media-amazon.com/images/I/6182S7MYC2L._AC_SL1000_.jpg',
        description: 'Meet Echo Dot - Our most popular smart speaker with a fabric design.',
        brand: 'Amazon',
        category: 'Electronics',
        price: 29.99,
        countInStock: 20,
        rating: 4,
        numReviews: 14,
    },
    {
        name: 'Samsung Galaxy S21 Ultra',
        image: 'https://m.media-amazon.com/images/I/61O45C5qASL._AC_SL1500_.jpg',
        description: 'Introducing the Galaxy S21 Ultra 5G. Designed with a unique contour-cut camera.',
        brand: 'Samsung',
        category: 'Electronics',
        price: 1199.99,
        countInStock: 4,
        rating: 4.5,
        numReviews: 22,
    },
    {
        name: 'Apple iPad Pro 12.9',
        image: 'https://tse3.mm.bing.net/th/id/OIP.nZ-IZWTu5tgAu7vwy4zWegHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        description: 'iPad Pro features the powerful Apple M1 chip for next-level performance.',
        brand: 'Apple',
        category: 'Electronics',
        price: 1099.99,
        countInStock: 6,
        rating: 5,
        numReviews: 31,
    },
    {
        name: 'Sony WH-1000XM4 Headphones',
        image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
        description: 'Industry leading noise canceling with Dual Noise Sensor technology.',
        brand: 'Sony',
        category: 'Electronics',
        price: 348.00,
        countInStock: 15,
        rating: 4.8,
        numReviews: 45,
    },
    {
        name: 'Nintendo Switch Lite',
        image: 'https://cdn.neow.in/news/images/galleries/4189/1569612790_img20190927161010.jpg',
        description: 'Handheld Nintendo Switch gaming at a great price.',
        brand: 'Nintendo',
        category: 'Electronics',
        price: 199.99,
        countInStock: 0,
        rating: 4.6,
        numReviews: 28,
    },
    {
        name: 'GoPro HERO9 Black',
        image: 'https://cdn.mos.cms.futurecdn.net/3NwbszmHSVSwi2nfcVgUB6.jpg',
        description: 'Capture stunning 5K video that maintains serious detail even when zooming in.',
        brand: 'GoPro',
        category: 'Electronics',
        price: 399.99,
        countInStock: 3,
        rating: 4.2,
        numReviews: 18,
    },
    {
        name: 'Apple Watch Series 7',
        image: 'https://tse3.mm.bing.net/th/id/OIP.Np42CmF2EwrADOHZQNpqEgHaFS?rs=1&pid=ImgDetMain&o=7&rm=3',
        description: 'The most advanced Apple Watch yet featuring a new screen and health features.',
        brand: 'Apple',
        category: 'Electronics',
        price: 399.00,
        countInStock: 12,
        rating: 4.7,
        numReviews: 60,
    }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await Product.deleteMany();
        console.log('Old products cleared');

        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
