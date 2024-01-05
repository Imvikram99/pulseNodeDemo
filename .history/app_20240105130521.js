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
