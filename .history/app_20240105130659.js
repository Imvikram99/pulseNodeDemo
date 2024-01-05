const express = require('express');
const { ApiMonitorSDK } = require('apipulse-node');
 // Importing your local npm package
const winston = require('winston'); // For logging

// Initialize winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const app = express();

app.use(express.json());
app.use(express.text());

// Initialize your local npm package
try {
  ApiMonitorSDK.init({
    url: "http://alb-test1-1116885660.ap-south-1.elb.amazonaws.com:8080",
    applicationName: "service-name3",
    teamName:"team1",
    environment: "your-environment",
    partnerId: "NODEMAN",
    authKey:"test123",
    loggingEnabled:"true",
    app:app
  });
  app.use(ApiMonitorSDK.capture());
  logger.info('ApiMonitorSDK initialized successfully');
} catch (error) {
  logger.error(`ApiMonitorSDK initialization failed: ${error}`);
}

app.get('/', (req, res) => {
  res.send('Hello, world1!');
});
app.get('/2', (req, res) => {
  res.send('Hello, world2!');
});
const users = new Map();
const products = new Map();
const transactions = new Map();

let userIdCounter = 0;
let productIdCounter = 0;
let transactionIdCounter = 0;

const usernameToIdMap = new Map();
const productNameToIdMap = new Map();

app.post('/ecommerce/user/register', (req, res) => {
  const user = req.body;
  if (usernameToIdMap.has(user.name)) {
      return res.status(400).json({ error: 'Username already exists' });
  }

  const userId = ++userIdCounter;
  user.id = userId;
  users.set(userId, user);
  usernameToIdMap.set(user.name, userId);

  res.json({ userId: userId });
});
app.post('/ecommerce/product/add', (req, res) => {
  const product = req.body;
  if (productNameToIdMap.has(product.name)) {
      return res.status(400).json({ error: 'Product name already exists' });
  }

  const productId = ++productIdCounter;
  product.id = productId;
  products.set(productId, product);
  productNameToIdMap.set(product.name, productId);

  res.json({ productId: productId });
});

app.post('/ecommerce/transaction/deposit', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.get(userId);
  if (!user) {
      return res.status(404).send('User not found');
  }

  user.balance = (user.balance || 0) + amount;
  const transactionId = ++transactionIdCounter;
  const transaction = { id: transactionId, userId, amount, type: 'DEPOSIT' };
  transactions.set(transactionId, transaction);

  res.json({ txnId: transactionId, updatedBalance: user.balance });
});

app.post('/ecommerce/transaction/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.get(userId);
  if (!user) {
      return res.status(404).send('User not found');
  }
  if (user.balance < amount) {
      return res.status(400).send('Insufficient balance');
  }

  user.balance -= amount;
  const transactionId = ++transactionIdCounter;
  const transaction = { id: transactionId, userId, amount, type: 'WITHDRAW' };
  transactions.set(transactionId, transaction);

  res.json({ txnId: transactionId, updatedBalance: user.balance });
});

app.put('/ecommerce/user/update/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const updatedUser = req.body;

  if (!users.has(userId)) {
      return res.status(404).send('User not found');
  }

  const user = users.get(userId);
  user.name = updatedUser.name;
  user.balance = updatedUser.balance;
  users.set(userId, user);

  res.json(user);
});

app.delete('/ecommerce/user/delete/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (!users.has(userId)) {
      return res.status(404).send('User not found');
  }

  users.delete(userId);
  res.send('User deleted successfully');
});

app.put('/ecommerce/product/update/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const updatedProduct = req.body;

  if (!products.has(productId)) {
      return res.status(404).send('Product not found');
  }

  const product = products.get(productId);
  product.name = updatedProduct.name;
  product.price = updatedProduct.price;
  products.set(productId, product);

  res.json(product);
});



app.get('/greet/:name', (req, res) => {
  const name = req.params.name; // Path variable
  const title = req.query.title; // Query parameter, e.g., ?title=Mr.

  let greeting = `Hello, ${name}`;

  if (title) {
      greeting = `Hello, ${title} ${name}`;
  }

  res.send(greeting);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
