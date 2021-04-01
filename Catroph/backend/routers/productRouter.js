import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
// middleware for handling exceptions inside of async express 
// routes and passing them to your express error handlers
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';


const productRouter = express.Router();

productRouter.get("/", expressAsyncHandler(async (req, res) => {
    // returns all the products in the database(Product)
    const products = await Product.find({});
    res.send(products);
}));

productRouter.get("/seed", expressAsyncHandler(async (req,res) => {
    // populates the Product database then send to frontend
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
}));

productRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product)
        res.send(product);
    else
        res.status(404).send({ message: "Product Not Found!" });
}));

// Create Products for admin users at /api/products/
productRouter.post("/", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample Name" + Date.now(),
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

productRouter.put("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // Updates product with the values user entered from frontend
    if(product) {
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

export default productRouter;
