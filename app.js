// ========== database ==========
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mystore';
let db;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  db = client.db(dbName);

  // client.close();
});

function addProduct (product) {
  const collection = db.collection('products');
  return collection.insertOne(product);
};

function getProducts (query, cb) {
  const newQuery = transform(query);
  const collection = db.collection('products');
  collection.find(newQuery).toArray((err, docs) => {
    cb(docs);
  });
}

function transform (query) {
  if (query.brand) {
    query.brand = { $in: query.brand }
  }

  return query;
}

// ========== express ==========
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/addProduct', (req, res) => {
  let product = req.body;

  addProduct(product)
  .then(result => {
    res.json(product);
  });
});

app.post('/getProducts', (req, res) => {
  getProducts(req.body, (products) => {
    res.json(products);
  });
})

app.listen(3000, () => console.log('Service is listening on port 3000!'))
