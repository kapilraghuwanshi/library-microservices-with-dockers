const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const orderSchema = require('./Order');
const Orders = mongoose.model('Orders', orderSchema);
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Database Connection
const dbUri = 'mongodb+srv://m001-student:m001-mongodb-basics@kapilsmongodbcluster0-wcr6p.mongodb.net/ordersservice?retryWrites=true&w=majority';
mongoose.connect(dbUri, (err) => {
    if (err) {
        console.log(`mongodb connection issue is- ${err}`);
    } else {
        console.log(`mongodb connection success`);
    }
});

// Routing
app.get('/', (req, res) => {
    res.send('This is the root order micro service endpoint');
});

app.post('/orders', (req, res) => {
    // instance model method
    let newOrder = new Orders({
        customerId: mongoose.Types.ObjectId(req.body.customerId),
        bookId: mongoose.Types.ObjectId(req.body.bookId),
        orderDate: req.body.orderDate,
        deliveryDate: req.body.deliveryDate
    });
    newOrder.save((err, doc) => {
        if (!err) {
            res.send(`New order ${doc} created and saved to mongodb cluster`);
        } else {
            res.status(422).send(['This order id already exist!']);
        }
    });
});

// List all customers
app.get('/orders', (req, res) => {
    // Static model method
    Orders.find((err, orderDocs) => {
        if (!err)
            res.json(orderDocs);
        else
            console.log(`Error in retrieving Orders collection - ${err}`);
    });
});

// communicating between other micro services
app.get('/order/:id', (req, res) => {
    // Static model method
    Orders.findById(req.params.id, (err, orderDocs) => {
        console.log(`Your order api response is ${orderDocs}`);
        if (orderDocs) {
            axios.get('http://localhost:5051/customer/' + orderDocs.customerId).then(custResp => {
                console.log(`Your customer api response is ${custResp}`);
                var orderObject = { CustomerName: custResp.data.name, bookTitle: '' };
                axios.get('http://localhost:5050/book/' + orderDocs.bookId).then(bookResp => {
                    console.log(`Your book api response is ${bookResp}`);
                    orderObject.bookTitle = bookResp.data.title;
                    res.json(orderObject);
                });
            });
        }
        else {
            console.log(`Error in retrieving Orders collection - ${err}`);
        }
    });
});

app.listen(5052, () => {
    console.log(`Your server is up and running on 5052 port`);
});