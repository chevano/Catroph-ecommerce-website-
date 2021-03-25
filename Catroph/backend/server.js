import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';

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

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.get("/", (req, res) => {
    res.send("Server is ready");
});

// Catches error in router which is later sent to frontend
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

// Checks if enviornment variable exist before using a default of 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});