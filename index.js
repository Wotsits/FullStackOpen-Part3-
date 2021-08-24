const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

//middleware setup
app.use(express.json())
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :total-time :content'))
app.use(cors())
app.use(express.static('build'))


let data = [
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

app.get("/api/persons/:id", (request,response) => {
    const id = Number(request.params.id)
    const entry = data.find(entry => entry.id === id)
    response.json(entry)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    notes = data.filter(note => note.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    
    const newPerson = request.body

    if ((!newPerson.name) || (!newPerson.number)) {
        return response.status(400).json({"error": "content missing"})
    }

    names = data.map(person => person.name)
    if (names.includes(newPerson.name)) {
        return response.status(400).json({"error": "person already exists"})
    }

    const maxID = data.length > 0 
        ? Math.max(...data.map(person => person.id))
        : 0 
    
    newPerson.id = maxID
    data = data.concat(newPerson)
    response.json(newPerson)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})