
const jwt = require('jsonwebtoken')

logger = require("./logger")


const userHandler = (req,res,next) =>{
    const decodedToken = jwt.verify(req.token,process.env.SECRET)
    req.user = decodedToken.id
    if (!req.user){
        res.status(401).json({error:"Token does not exist"})
    }
    next()
}

const tokenHandler = (req,res,next) =>{
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')){
        req.token = authorization.substring(7)
    }
    next()
}


const errHandler = (err,req,res,next) =>{
    if (err.name === 'CastError'){
        res.status(400).json({error:"Malformatted ID"})
    }
    else if (err.name === "ValidationError"){
        res.status(400).json({error:err.message})
    }
    else if (err.name === "JsonWebTokenError"){
        return res.status(401).json({error:"Invalid token"})
    }
    else if (err.name === 'TokenExpiredError'){
        return res.status(401).json({error:'Expired token'})
    }
    next(err)
}

const requestLogger = (req,res,next) =>{
    logger.info("METHOD: ",req.method)
    logger.info("PATH: ",req.path)
    logger.info("BODY: ",req.body)
    next()
}

const unknownEndpoint = (req,res,next) =>{
    res.status(404).json('Error: Unknown Endpoint')
}

module.exports = {userHandler,tokenHandler,errHandler,requestLogger,unknownEndpoint}