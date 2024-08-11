import asyncHandler from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler( async (req,res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword 
        ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};    
 
    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({ products, page, pages:Math.ceil(count / pageSize) });
});


// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req,res)=> {
    const product = await Product.findById(req.params.id);

    if (product){
        return res.json(product);
    }
    return res.status(404).json({message:'Product not found'});
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
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

        console.log('Updating product with image path:', image);
        const updatedProduct = await product.save();
        console.log('Updated product:', updatedProduct);
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    //const product = await Product.findById(req.params.id);
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id:product._id });
        res.status(200).json({ message: 'Product deleted' })
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if the user has a paid order for the product
        const paidOrder = await Order.findOne({
            user: req.user._id,
            'orderItems.product': req.params.id,
            isPaid: true,
        });

        if (!paidOrder) {
            res.status(400);
            throw new Error("You've to purchase the product before reviewing");
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});




// @desc    Get top rated product
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req,res)=> {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.status(200).json(products);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
};
