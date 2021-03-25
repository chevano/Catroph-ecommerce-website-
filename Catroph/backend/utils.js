import jwt from 'jsonwebtoken';

// Generates a hash string that is used for your next request to authenticate 
// your current request which provides a way to authenticates the user
export const generateToken = (user) => {
    return jwt.sign(
        // The object needed to generate a token(payload)
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || "mySecret", // key to encrypt token(secret)
        {
            expiresIn: "30d", // expiration is in 30 days(timestamp which is optional)
        }
    );
}