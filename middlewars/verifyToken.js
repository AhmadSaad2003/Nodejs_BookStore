const jwt = require("jsonwebtoken");

function verifyToken(req,res,next){
    const token =req.headers.token;
    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRETKEY);//it opens the payload of the token
            req.user = decoded;
            next();
        }catch(error){
            res.status(401).json({message:"invalid token"});
        }
    }else{
        res.status(401).json({message:"no token provided"});
    }
}

function verifyTokenAnd(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id ===req.params.id){
            next();
        }else{
            return res.status(403).json({message:"you nare not allowed"});
        }
    })
}
module.exports={
    verifyToken,
    verifyTokenAnd
}