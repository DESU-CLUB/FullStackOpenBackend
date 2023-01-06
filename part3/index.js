const express = require('express')
//const morgan = require('morgan')
const cors = require('cors')
app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
//morgan.token('data',(req,res)=>{
    //return JSON.stringify(req.body)})

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    const len = persons.length
    timestamp = new Date().toUTCString()
    console.log(len,timestamp)
    res.send(`Phonebook has info for ${len} people</br>${timestamp}`)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    if (person){
        res.json(person)
    }
    else{
        res.status(404).send("Item not found")
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(p=>p.id !== id)
    console.log(persons)
    res.status(204).json({id:"id"})
})

app.post('/api/persons',(req,res)=>{
    const person = req.body
    if (person.name === undefined){
        res.status(400).send("Bad request")
    }
    else if (persons.filter(p =>p.name === person.name).length !== 0){
        res.status(400).send('Name already exists in persons')
    }
    else{
        const newId = Math.floor(Math.random()*1000)
        persons = persons.concat({...person,id:newId})
        res.status(200).json({...person,id:newId})
    }
})


const PORT = process.env.PORT || "8080"
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})

