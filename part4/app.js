require('express-async-errors')
const middleware= require("./utils/middleware")
const logger = require("./utils/logger")
const Blog = require("./models/blog")
const cors = require('cors')

const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/loginRouter')
const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require("express")

const app = express()

logger.info(`Connecting to ${config.MONGODB_URI}`)
mongoose.connect(config.MONGODB_URI)
.then(()=>{
    logger.info("Connected to MongoDB")
})
.catch(err => logger.error("Error connecting to MongoDB"))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenHandler)

app.use('/api/login',loginRouter)
app.use('/api/blog',middleware.userHandler,blogRouter)
app.use('/api/users',userRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errHandler)

module.exports = app