import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
// middleware for handling exceptions inside of async express 
// routes and passing them to your express error handlers
import expressAsyncHandler from 'express-async-handler';


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
}))

export default productRouter;