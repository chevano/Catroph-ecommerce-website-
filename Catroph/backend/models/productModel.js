import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, default: "Sample username", required: true },
        comment: { type: String, default: "Sample Comment", required: true },
        rating: { type: Number, default: 0, required: true }
    },
    {
        timestamps: true
    }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        numReviews: { type: Number, required: true },
        reviews: [reviewSchema]
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;