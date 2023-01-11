
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        minLength:3
    },
    name: String,
    passwordHash: String,
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
})

userSchema.set('toJSON',{
    transform: (document,returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

model = mongoose.model('User',userSchema)

module.exports = model;