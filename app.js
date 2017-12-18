// ========== database ==========
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mystore';
let db;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  console.log('Connected successfully to server');

  db = client.db(dbName);
  // client.close();
});

function transform (query) {
  if (query.name) {
    query.name = new RegExp('.*' + query.name + '.*', 'i');
  }

  if (query.brand) {
    query.brand = { $in: query.brand }
  }

  if (query.os) {
    query.os = { $in: query.os }
  }

  return query;
}

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

function getProduct (query) {
  if (query._id) {
    const collection = db.collection('products');
    const ObjectID = require('mongodb').ObjectID;
    return collection.findOne({ '_id' : ObjectID(query._id) });
  }
  else {
    return Promise.resolve({});
  }
}

function deleteProduct (query) {
  if (query._id) {
    const collection = db.collection('products');
    const ObjectID = require('mongodb').ObjectID;
    return collection.deleteOne({ '_id' : ObjectID(query._id) });
  }
  else {
    return Promise.resolve({});
  }
}

function updateProduct (product) {
  if (product._id) {
    const collection = db.collection('products');
    const ObjectID = require('mongodb').ObjectID;
    const id = product._id;
    delete product._id;
    return collection.replaceOne(
      { '_id' : ObjectID(id) },
      product
    );
  }
  else {
    return Promise.resolve({});
  }
}


// ========== express ==========
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/addProduct', (req, res) => {
  let product = req.body;

  addProduct(product)
    .then(result => {
      res.json({});
    });
});

app.post('/getProducts', (req, res) => {
  getProducts(req.body, (products) => {
    res.json(products);
  });
});

app.post('/getProduct', (req, res) => {
  getProduct(req.body)
    .then(product => {
      res.json(product);
    });
});

app.post('/deleteProduct', (req, res) => {
  deleteProduct(req.body)
    .then(result => {
      res.json({});
    });
});

app.post('/updateProduct', (req, res) => {
  updateProduct(req.body)
    .then(result => {
      res.json({});
    });
});

app.listen(3000, () => console.log('Service is listening on port 3000!'))
