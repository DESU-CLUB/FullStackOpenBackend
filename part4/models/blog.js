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
    likes: {type:Number, default:0},
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

blogSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog',blogSchema)
