const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://Mixu:${password}@cluster0.rxol8.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(res => {
        console.log(`added ${res.name} number ${res.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(p.name, p.number)
        });
        mongoose.connection.close()
    })
}