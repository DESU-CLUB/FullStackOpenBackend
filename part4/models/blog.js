const mongoose  = require("mongoose")
const {MONGODB_URI} = require("../utils/config")
const logger = require("../utils/logger")

blogSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        minLength: 3
    },
    url: {
        type: String,
        required: String
    },
    likes: Number,

})

blogSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog',blogSchema)