const mongoose  = require("mongoose")
const {MONGODB_URI} = require("../utils/config")
const logger = require("../utils/logger")


commentSchema =  new mongoose.Schema({
    comment:{
        type: String,
        required: true,
        maxLength: 100
    },
    
    blog: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }

})

commentSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Comment',commentSchema)
