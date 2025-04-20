const jwt = require("jsonwebtoken");

const isAuthorized = async (req, res, next)=> {
try {
    const token = req.cookies.token;
    if(!token){
        throw new Error("User not authorized!")
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if(!decode){
        throw new Error("Invalid Token")
    }
    req.id = decode.id;
    next();
} catch (error) {
    res.status(400).json({error: error.message})
}
}

module.exports = isAuthorized