const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookSchema = require('./Book');

const app = express();
app.use(bodyParser.json());
const Books = mongoose.model('Books', bookSchema);

// Database Connection
const dbUri = 'mongodb+srv://m001-student:m001-mongodb-basics@kapilsmongodbcluster0-wcr6p.mongodb.net/booksservice?retryWrites=true&w=majority';
mongoose.connect(dbUri, (err) => {
    if (err) {
        console.log(`mongodb connection issue is- ${err}`);
    } else {
        console.log(`mongodb connection success`);
    }
});

// Routing
app.get('/', (req, res) => {
    res.send('This is books micro service endpoint');
});

app.post('/books', (req, res) => {
    let newBook = {
        title: req.body.title,
        author: req.body.author,
        version: req.body.version,
    };
    let book = new Books(newBook);
    book.save().then(() => {
        console.log(`New book object ${newBook} saved`);
    }).catch((err) => {
        if (err)
            throw err;
    });
    res.send(`New book object ${newBook} saved to mongodb cluster`);
});

app.listen(5050, () => {
    console.log(`Your server is up and running on 5050 port`);
});