const express = require('express');
const { ShortloopSDK } = require('ajent');
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
  ShortloopSDK.init({
    url: "http://localhost:8080",
    applicationName: "service-name1",
    teamName:"team1",
    environment: "your-environment",
    partnerId: "NODEMAN",
    authKey:"test123",
    loggingEnabled:true,
    app:app
  });
  app.use(ShortloopSDK.capture());
  logger.info('ShortloopSDK initialized successfully');
} catch (error) {
  logger.error(`ShortloopSDK initialization failed: ${error}`);
}

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
