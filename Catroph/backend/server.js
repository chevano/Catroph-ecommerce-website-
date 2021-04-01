import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import path from 'path';

// Allows us to use the dotenv environment variables file
dotenv.config();

const app = express();

// The two middleware below ensures that the incoming request transfer the data to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/catroph', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

// returns the absolute path of the current working directory
const __dirname = path.resolve();

// serves the files inside frontend/build
app.use(express.static(path.join(__dirname,"frontend/build")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend/build/index.html"))
});

// Used to render photo
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// app.get("/", (req, res) => {
//     res.send("Server is ready");
// });

// Catches error in router which is later sent to frontend
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

// Checks if enviornment variable exist before using a default of 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
