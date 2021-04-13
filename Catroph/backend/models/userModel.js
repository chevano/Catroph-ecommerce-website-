import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false, required: true},
        isSeller: {type: Boolean, default: false, required: true},
        seller: {
            _id: { type: Schema.Types.ObjectId },
            sellerName: { type: String, default: 'Sample Seller Name', required: true }, 
            sellerLogo: { type: String, default: 'Sample Seller Logo', required: true },
            sellerSlogan: { type: String, default: 'Sample Seller Slogan', required: true },
            sellerRating: { type: Number, default: 0, required: true },
            sellerNumReviews: { type: Number, default: 0, required: true },
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;