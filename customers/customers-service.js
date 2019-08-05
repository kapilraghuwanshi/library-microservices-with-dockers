const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var ObjectId = require('mongoose').Types.ObjectId;
const customerSchema = require('./Customer');
const Customers = mongoose.model('Customers', customerSchema);

const app = express();
app.use(bodyParser.json());

// Database Connection
const dbUri = 'mongodb+srv://m001-student:m001-mongodb-basics@kapilsmongodbcluster0-wcr6p.mongodb.net/customersservice?retryWrites=true&w=majority';
mongoose.connect(dbUri, (err) => {
    if (err) {
        console.log(`mongodb connection issue is- ${err}`);
    } else {
        console.log(`mongodb connection success`);
    }
});

// Routing
app.get('/', (req, res) => {
    res.send('This is the root customers micro service endpoint');
});
// Save new customer to mongo cluster
app.post('/customers', (req, res) => {
    // instance model method
    let newCustomer = new Customers({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
    });
    newCustomer.save((err, doc) => {
        if (!err) {
            res.send(`New customer object ${doc} saved to mongodb cluster`);
        } else {
            res.status(422).send(['This customer already exist!']);
        }
    });
});
// List all customers
app.get('/customers', (req, res) => {
    // Static model method
    Customers.find((err, custDocs) => {
        if (!err)
            res.json(custDocs);
        else
            console.log(`Error in retrieving Customers collection - ${err}`);
    });
});

// Find a customer by it's id
app.get('/customer/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.status(400).send(`No customer records with given id - ${req.params.id}`);
    Customers.findById(req.params.id, (err, custDoc) => {
        if (!err)
            res.json(custDoc);
        else
            console.log(`Error in retrieving Customers collection - ${err}`);
    });
});

// Find and Delete a book by it's id
app.delete('/customer/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.status(400).send(`No customer records with given id - ${req.params.id}`);
    Customers.findByIdAndRemove(req.params.id, (err, custDoc) => {
        if (!err)
            res.send(`Book with id ${custDoc._id} deleted successfully`);
        else
            console.log(`Error in deleting customer - ${err}`);
    });
});

app.listen(5051, () => {
    console.log(`Your server is up and running on 5051 port`);
});