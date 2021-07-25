
require("dotenv").config()
const { response } = require("express")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))
app.use(express.static("build"))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get("/info", (req, res) => {
    Person.find({}).then(result => {
        res.send(`
        <p>Phonebook has info for ${result.length} people</p>
        <p>${new Date()}</p>
        `)
    })
})

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    console.log(body)
    if (!body.name){
        return res.status(400).json({
            error:"name missing"
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})