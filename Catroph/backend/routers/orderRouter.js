import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import Order from '../models/orderModel.js'

const orderRouter = express.Router();

orderRouter.get("/", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    // .find({...sellerFilter}) returns all the orders in the database(Order)
    // if user is not a seller otherwise it returns all the orders of the current seller
    // .populate("user",name) goes to the user field inside Order
    // and retrieves the name field info inside user database (User)
    // In the end, the complete statement will attach a user.name field inside orders
    // const orders = await Order.find({ ...sellerFilter}).populate('user', 'name');
    const orders = await Order.find({ ...sellerFilter}).populate('user');
    res.send(orders); 
}));

orderRouter.get("/mine", isAuth, expressAsyncHandler(async(req, res) => {
    // Returns the order history of the current user
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}));

orderRouter.post("/", isAuth, expressAsyncHandler(async (req, res) => {
    // Check if user forgot to add items to the shopping cart
    if(req.body.orderItems.length === 0) 
        res.status(400).send({ message: "Cart is empty"});
    else {
        const order = new Order({
            seller: req.body.orderItems[0].seller,
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });

        const createdOrder = await order.save();
        res.status(201).send({ message: "New Order Created", order: createdOrder });
    }
}));

// Is the api for getting the details of an order
// Recall the prefix is "/api/orders" defined in server.js
// Only authenticated users can see order details
orderRouter.get("/:id", isAuth, expressAsyncHandler(async (req, res) => {
    // Retrieves order from the database
    const order = await Order.findById(req.params.id);

    if(order) 
        res.send(order);
    else
        res.status(404).send({ message: "Order Not Found" });

}));

// Update the status of an order
orderRouter.put("/:id/pay", isAuth, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isPaid = true;
        order.dateOfPurchase = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const updateOrder = await order.save();
        res.send({ message: "Order Paid", order: updateOrder });
    }
    else
        res.status(404).send({ message: "Order Not Found" });

}));

orderRouter.delete("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        const deleteOrder = await order.remove();
        res.send({ message: "User Deleted", order: deleteOrder});
    }
    else
        res.send({ message: "Order Not Found" });
}));

orderRouter.put("/:id/deliver", isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.dateOfDelivery = Date.now();
       
        const updateOrder = await order.save();
        res.send({ message: "Order Delivered", order: updateOrder });
    }
    else
        res.status(404).send({ message: "Order Not Found" });

}));


export default orderRouter;