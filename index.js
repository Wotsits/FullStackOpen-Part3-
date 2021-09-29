require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/listing')

//middleware setup
app.use(express.json())
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :total-time :content'))
app.use(cors())
app.use(express.static('build'))

app.get('/info', (request, response, next) => {
    Person
        .find({})
        .then(people => {
            const recordCount = people.length
            const now = new Date(Date.now()).toString()
            response.send(`<p>Phonebook has info for ${recordCount} people</p><p>${now}</p>`)
        })
})

app.get("/api/persons", (request, response) => {
    Person
        .find({})
        .then(people => {
            response.json(people)
        })
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => { 
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error => next(error))
        })
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const updatedData = request.body
    
    Person.findByIdAndUpdate(request.params.id, updatedData, { 
        new: true, 
        runValidators: true, 
        context: 'query' 
    })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    
    const newPerson = request.body
    
    const person = new Person({
        name: newPerson.name,
        number: newPerson.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error:'malformatted id'})
    }
    if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`)
})