require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Listing = require('./models/listing')

//middleware setup
app.use(express.json())
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :total-time :content'))
app.use(cors())
app.use(express.static('build'))

/*
app.get("/info", (request, response) => {
    const today = new Date().toString()
    const output = `
        <p>Phonebook has info for ${data.length} people.</p>
        <p>${today}</p>
    `
    response.send(output)
})
 
app.get("/api/persons", (request, response) => {
    response.json(data)
})
*/

app.get("/api/persons/:id", (request, response) => {
    const entry = Listing.findById(request.params.id).then(listing => { 
        response.json(listing)
    })
})

/*
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    notes = data.filter(note => note.id !== id)

    response.status(204).end()
})
*/

app.post("/api/persons", (request, response) => {
    
    const newPerson = request.body

    if ((!newPerson.name) || (!newPerson.number)) {
        return response.status(400).json({"error": "content missing"})
    }
    /*
    names = data.map(person => person.name)
    if (names.includes(newPerson.name)) {
        return response.status(400).json({"error": "person already exists"})
    }
    */

    const listing = new Listing({
        name: newPerson.name,
        number: newPerson.number
    })
    listing.save().then(savedListing => {
        response.json(savedListing)
    })
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`)
})