logger = require("./logger")
const errHandler = (err,req,res,next) =>{
    if (err.name === 'CastError'){
        res.status(400).json({"Error":"Malformatted ID"})
    }
    else if (err.name === "ValidationError"){
        res.status(400).json({Error:err.message})
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

module.exports = {errHandler,requestLogger,unknownEndpoint}