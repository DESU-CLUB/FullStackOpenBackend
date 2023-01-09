const express = require('express')
//const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/persons')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
//morgan.token('data',(req,res)=>{
//return JSON.stringify(req.body)})

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


const errHandler = (err,req,res,next) => {
  console.log(err.message)
  if (err.name === 'CastError'){
    return res.status(400).json({ error:'Malformed id' })
  }
  else if (err.name === 'ValidationError'){
    console.log(err.message)
    return res.status(400).json({ error: err.message })
  }
  next(err)
}


app.get('/api/persons',(req,res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })

})

app.get('/info',(req,res) => {
  Person.count({}).then(count => {
    console.log(count)
    const timestamp = new Date().toUTCString()
    res.send(`Phonebook has info for ${count} people</br>${timestamp}`)
  })
})

app.get('/api/persons/:id',(req,res,next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person){
        res.json(person)
      }
      else{
        res.status(404).json({ error:'Item not found' })
      }
    })
    .catch(err => {
      next(err)
    })

})

app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

app.post('/api/persons',(req,res,next) => {
  const person = req.body
  if (person.name === undefined || person.number  === undefined){
    res.status(400).send('Bad request')
  }
  else{
    Person.count({ name:person.name })
      .then(count => {
        if (count >0){
          res.status(400).json({ error:'Duplicate name' })
        }
        else{
          const newPerson = new Person({
            name: person.name,
            number: person.number
          })


          newPerson.save().then(savedPerson => {
            res.status(200).json(savedPerson)
          })
            .catch(err => next(err))
        }
      })
      .catch(err => next(err))


  }
})

app.put('/api/persons/:id',(req,res,next) => {
  const body = req.body
  if (body.name === undefined || body.number=== undefined ){
    res.json({ error:'Invalid Input' })
  }
  else{
    const person = {
      name : body.name,
      number : body.number
    }

    Person.findByIdAndUpdate(req.params.id,person,
      { new:true, runValidators: true, context:'query' })
      .then(updatedNote => {
        res.json(updatedNote)
      })
      .catch(err => {next(err)})
  }
})

app.use(errHandler)

const PORT = process.env.PORT || '8080'
app.listen(PORT,() => {
  console.log(`Server running on PORT ${PORT}`)
})

