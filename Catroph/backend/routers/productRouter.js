import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import mongoose from 'mongoose';
// middleware for handling exceptions inside of async express 
// routes and passing them to your express error handlers
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin, isSellerOrAdmin } from '../utils.js';
import User from '../models/userModel.js';


const productRouter = express.Router();

productRouter.get("/seed", expressAsyncHandler(async (req,res) => {
    const seller = await User.findOne({ isSeller: true });
    if(seller) {
        const products = data.products.map((product) => ({
            ...product,
            seller: seller._id
        }));
        // populates the Product database then send to frontend
        const createdProducts = await Product.insertMany(products);
        res.send({ createdProducts });
    }
    else
        res.status(500).send({ message: "No seller found. First run /api/users/seed"})
}));

productRouter.get("/", expressAsyncHandler(async (req, res) => {
    const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;
    const name = req.query.name || "";
    const category = req.query.category || "";
    const seller = req.query.seller || "";
    const order = req.query.order || "";
    // Checks if some characters matches the name field(not case sensitive)
    const nameFilter = name ? { name: { $regex: name, $options: 'i'} } : {};
    // Sets the price range based on the min and max
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const categoryFilter = category ? { category } : {};
    const sellerFilter = seller ? { seller } : {};
    const sortOrder  = 
        order === "lowest" ? {price: 1}
        : 
        order === "highest" ? {price: -1}
        :
        order === "toprated" ? {rating: -1}
        : {_id: -1}
    // returns all the products in the database(Product) if filter is empty
    // otherwise it will return the products of the current seller
    const products = await Product.find({ 
        ...sellerFilter, 
        ...nameFilter, 
        ...categoryFilter, 
        ...priceFilter, 
        ...ratingFilter 
    }).populate({path: 'seller', model: 'User'})
    .sort(sortOrder);

    res.send(products);
}));

// Returns all distinct products by their category
productRouter.get("/categories", expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
}))

// Create Products for admin users at /api/products/
productRouter.post("/", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample Name" + Date.now(),
        seller: req.user._id,
        image: "/images/p1.jpeg",
        price: 0,
        category: "Sample Category",
        brand: "Sample Brand",
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: "Sample Description"
    });

    const createdProduct = await product.save();
    res.send({ message: "Product Created", product: createdProduct });
}));

productRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({path: 'seller', model: 'User'});

    if(product)
        res.send(product);
    else
        res.status(404).send({ message: "Product Not Found!" });
}));

productRouter.put("/:id", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // Updates product with the values user entered from frontend
    if(product) {
        const seller = mongoose.Types.ObjectId(req.params.seller);
        product.seller = seller;
        // product.seller = req.user._id;
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        
        const updatedProduct = await product.save();
        // Sends back the updated product to frontend
        res.send({ message: "Product Updated", product: updatedProduct });
    }
    else
        res.status(404).send({ message: "Product Not Found" });
}));

productRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        const deleteProduct = await product.remove();
        res.send({ message: "Product Deleted", product: deleteProduct });
    }
    else
        res.status(404).send({ message: "Product Not Found" });
}));

productRouter.post("/:id/reviews", isAuth, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // Creates a review for a particular product
    if(product) {
        // Forces the user to only enter one review per product
        if( product.reviews.find( (loggedUser) => loggedUser.name === req.user.name) )
            return res.status(400).send({ message: "You already submitted a review"});

        const review = {
            name: req.user.name,
            rating: Number(req.body.rating),
            comment: req.body.comment
        };

        product.reviews.push(review);
        if(product.numReviews)
            product.numReviews = product.numReviews + product.reviews.length;
        else
            product.numReviews = product.reviews.length;

        if(product.rating) {
            product.rating = (product.rating + product.reviews.reduce( (accumulator, currentItem) => 
            currentItem.rating + accumulator, 0)) / product.reviews.length;
        }
        else {
            product.rating = product.reviews.reduce( (accumulator, currentItem) => 
            currentItem.rating + accumulator, 0) / product.reviews.length;
        }
        const updatedProduct = await product.save();
        // Sends back the updated product to frontend
        res.status(201).send({ 
            message: "Review Created", 
            review: updatedProduct.reviews[updatedProduct.reviews.length - 1] 
        });
    }
    else
        res.status(404).send({ message: "Product Not Found" });
}));

export default productRouter;