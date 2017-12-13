// ========== database ==========
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mystore';
let db;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);

  // client.close();
});

function addProduct(product) {
  const collection = db.collection('products');
  collection.insertOne(product);
};

function getProducts(cb) {
  const collection = db.collection('products');
  collection.find({}).toArray((err, docs) => {
    cb(docs);
  });
}

// ========== express ==========
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/addProduct', (req, res) => {
  // let product = {
  //   name: 'Apple iPhone X 256 GB',
  //   category: 'Mobile Phone',
  //   brand: 'Apple',
  //   os: 'iOS',
  //   price: '1149'
  // };
  // let product = {
  //   name: 'Samsung Galaxy S8 64 GB',
  //   category: 'Mobile Phone',
  //   brand: 'Samsung',
  //   os: 'Android',
  //   price: '719'
  // };
  // addProduct(product);
});

app.get('/getProducts', (req, res) => {
  getProducts((products) => {
    console.log(products);
    res.json(products);
  });
})

app.listen(3000, () => console.log('Service is listening on port 3000!'))
