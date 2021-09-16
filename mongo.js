const mongoose = require('mongoose')

console.log(process.argv.length)
let instruction
let password
let newName
let newNumber

if (process.argv.length === 3) {
    instruction = "find"
    password = process.argv[2]
}

if (process.argv.length === 5) {
    instruction = "add"
    password = process.argv[2]
    newName = process.argv[3]
    newNumber = process.argv[4]
}

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
    console.log('Usage: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const url = `mongodb+srv://H3ll0M0ng0DB:${password}@cluster0.x9zrf.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema( {
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (instruction === "find") {
    Person
        .find({})
        .then(result => {
            result.forEach(result => {
                console.log(result)
            })
        })
        .then(response => {mongoose.connection.close()})
}
else {
    const person = new Person({
        name: newName,
        number: newNumber
    })
    
    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
}

