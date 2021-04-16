import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth, isSellerOrAdmin, payOrderEmailTemplate, mailgun } from '../utils.js';
import Order from '../models/orderModel.js'
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


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

// Does calculating using aggregate functions
// Refer to mongodb docs for more info
orderRouter.get("/summary", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null, 
                numOrders: {$sum: 1}, // counts the number of orders in Order db
                totalSales: { $sum: "$totalPrice"}
            }
        }
    ]);

    const users = await User.aggregate([
        {
            $group: {
                _id: null, 
                numUsers: {$sum: 1},
            }
        }
    ]);

    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },
                orders: { $sum: 1},
                sales: { $sum: "$totalPrice"}
            }
        },
        {
            $sort: { _id: 1}
        }
    ]);

    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1}
            }
        }
    ]);

    res.send({ orders, users, dailyOrders, productCategories })
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
    const order = await Order.findById(req.params.id).populate("user", "email name");

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
        await mailgun().messages().send({
            from: `Catroph <catroph@mg.yourdomain.com>`,
            to: `${order.user.name} <${order.user.email}>`,
            subject: `Order ${order._id}`,
            html: payOrderEmailTemplate(order),
        }, 
        (error, body) => {
            if(error)
                console.log(error);
            else
                console.log(body);
        });

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
