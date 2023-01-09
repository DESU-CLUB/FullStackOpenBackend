const mongoose = require('mongoose')

if (process.argv.length !==5 && process.argv.length !== 3){
  console.log(process.argv.length,'Invalid input, missing parameters')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://DESU-CLUB:${password}@cluster0.ukitsbs.mongodb.net/personsApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person',personSchema)

mongoose.connect(url)
  .then( () => {
    console.log('Connected!')
    if (process.argv.length === 5){
      const person = new Person({
        name: process.argv[3],
        number:process.argv[4],
      })
      console.log('Saving......')
      return person.save()
    }
    else {
      return Person.find({})
        .then(persons => {
          persons.forEach(p => console.log(p))
        })
    }
  })
  .then(() => {
    if (process.argv.length === 5){
      console.log('Saved!')
    }
    mongoose.connection.close()
  })
