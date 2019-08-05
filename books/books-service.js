const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookSchema = require('./Book');
const Books = mongoose.model('Books', bookSchema);

const app = express();
app.use(bodyParser.json());

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
    res.send('This is the root books micro service endpoint');
});
// Save new books to mongo cluster
app.post('/books', (req, res) => {
    let newBook = {
        title: req.body.title,
        author: req.body.author,
        version: req.body.version,
    };
    // instance model method
    let book = new Books(newBook);
    book.save().then(() => {
        console.log(`New book object ${newBook} saved`);
    }).catch((err) => {
        if (err)
            throw err;
    });
    res.send(`New book object ${newBook} saved to mongodb cluster`);
});
// List all books
app.get('/books', (req, res) => {
    // Static model method
    Books.find().then((booksResp) => {
        res.json(booksResp);
    }).catch((err) => {
        if (err)
            throw err;
    });
});

// Find a book by it's id
app.get('/book/:id', (req, res) => {
    Books.findById(req.params.id).then((bookResp) => {
        if (bookResp) {
            res.json(bookResp);
        } else {
            res.status(404).send(['No books with given id found!']);
        }
    }).catch((err) => {
        if (err)
            throw err;
    });
});
// Find and Delete a book by it's id
app.delete('/book/:id', (req, res) => {
    Books.findOneAndRemove(req.params.id).then(() => {
        res.send(`Book with id ${req.params.id} deleted successfully`);
    }).catch((err) => {
        if (err)
            throw err;
    });
});

app.listen(5050, () => {
    console.log(`Your server is up and running on 5050 port`);
});