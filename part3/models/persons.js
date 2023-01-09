const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to mongoDB')

mongoose.connect(url)
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch(err => {
    console.log('Failed to connect:',err.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String,
    minLength: 3,
    required: true
  },
  number: { type: String,
    minLength:8,
    validate:{ validator:
                function(v){ return /^(\d{2,3}-\d{1,})(?!-)\b/.test(v)},
    message: props => `${props.value} is not a valid phone number!`
    },

    required:true
  }
})


personSchema.set('toJSON',{
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('person',personSchema)