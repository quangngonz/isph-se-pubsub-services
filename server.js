const express = require('express');
const cors = require('cors');
const ioredis = require('ioredis');

const {processEvent} = require('./functions/proccessEvent');

const engine = require('./engine');
const savePortfolioValue = require('./functions/saveCurrentPortfolioValue');
const {generateBangerHeadline} = require("./services/evaluation/eventEvaluation");

// Generate a random interval between 5 and 300 seconds
const generateRandomInterval = () => {
  return Math.floor(Math.random() * (300000 - 5000 + 1)) + 5000;
};

const runEngine = async (time_passed) => {
  try {
    await engine.engine(time_passed);
    const next_interval = generateRandomInterval();
    console.log(`Next run in ${next_interval / 1000} seconds`);
    setTimeout(async () => {
      await runEngine(next_interval);
    }, next_interval);
  } catch (error) {
    console.error("Error in runEngine:", error);
    // Optionally, retry after a fixed delay
    setTimeout(() => runEngine(time_passed), 5000);
  }
};

runEngine(generateRandomInterval()).then(() => console.log('Engine started'));

const runSavePortfolioValue = async () => {
  try {
    await savePortfolioValue.saveDailyPortfolioValues();
    setTimeout(runSavePortfolioValue, 86400000); // Run every 24 hours
  } catch (error) {
    console.error('Error in runSavePortfolioValue:', error);
    setTimeout(runSavePortfolioValue, 5000);
  }
}

runSavePortfolioValue().then(() => console.log('Save Portfolio Value started'));

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: '*',
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const port = process.env.PORT || 3000;

const redisUrl = process.env.REDIS_URL

console.log('Redis URL:', redisUrl);

const publisher = new ioredis(redisUrl, {
  ...(process.env.NODE_ENV === 'production' && {
    tls: {rejectUnauthorized: false},
  }),
  maxRetriesPerRequest: null,
});

const subscriber = new ioredis(redisUrl, {
  ...(process.env.NODE_ENV === 'production' && {
    tls: {rejectUnauthorized: false},
  }),
  maxRetriesPerRequest: null,
});

// Subscribe to event-queue channel
subscriber.subscribe('event-evaluation-queue', async (err, count) => {
  if (err) {
    console.error('Error subscribing to Redis channel', err);
    return;
  }
  console.log(`Listening to 'event-evaluation-queue' channel`);
  console.log(`Subscribed to ${count} channel(s)`);
});

subscriber.subscribe('event-projection-queue', (err, count) => {
  if (err) {
    console.error('Error subscribing to Redis channel', err);
    return;
  }
  console.log(`Listening to 'event-projection-queue' channel`);
  console.log(`Subscribed to ${count} channel(s)`);
});

subscriber.subscribe('generate-banger-headline-queue', (err, count) => {
  if (err) {
    console.error('Error subscribing to Redis channel', err);
    return;
  }
  console.log(`Listening to 'generate-banger-headline-queue' channel`);
  console.log(`Subscribed to ${count} channel(s)`);
});

// Listen for messages in the Redis queue
subscriber.on('message', async (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);

  if (channel === 'event-evaluation-queue') {
    await processEvent(message);
  }

  if (channel === 'event-projection-queue') {
    console.log('Projection task received:', message);
  }

  if (channel === 'generate-banger-headline-queue') {
    console.log('Banger headline task received:', message);
    generateBangerHeadline(message);

  }
});

app.get('/', (req, res) => {
  res.redirect('https://isph-sse.vercel.app');
});

app.post('/trigger-task', async (req, res) => {
  const {eventId} = req.body; // Extract from JSON payload

  if (!eventId) {
    return res.status(400).send('Missing eventId query parameter');
  }

  try {
    const message = {eventId};
    await publisher.publish('event-evaluation-queue', JSON.stringify(message));
    res.status(200).send('Task triggered');
  } catch (error) {
    res.status(500).send(`Error triggering task: ${error.message}`);
  }
});

app.post('/generate-banger-headline', async (req, res) => {
  const {eventId} = req.body; // Extract from JSON payload

  if (!eventId) {
    return res.status(400).send('Missing eventId query parameter');
  }

  try {
    const message = {eventId};
    await publisher.publish('generate-banger-headline-queue', JSON.stringify(message));
    res.status(200).send('Task triggered');
  } catch (error) {
    res.status(500).send(`Error triggering task: ${error.message}`);
  }
});

// Start Express server
app.listen(port, () => {
  console.log('ISPH SE Server');
  console.log(`Server is running on port ${port}`);
});
