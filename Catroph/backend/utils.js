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
};

// Middleware to authenticate user
export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        // format: Bearer XXXXX, where XXXXX is the token
        const token = authorization.slice(7, authorization.length);
        // decrypt the token(decode contains the data inside token)
        jwt.verify(token, process.env.JWT_SECRET || "mySecret", (err, decode) => {
            // Checks if token is invalid
            if(err)
                res.status(401).send({ message: "Invalid Token" });
            else {
                req.user = decode;
                next(); // Passes user as a property of request to the next middleware
            }
        })
    }
    else
        res.status(401).send({ message: "No Token" });    
};

// Middleware to authenticate Admin
export const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin)
        next();
    else
        res.status(401).send({ message: "Invalid Admin Token"});
};
