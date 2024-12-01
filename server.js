const express = require('express');
const cors = require('cors');
const ioredis = require('ioredis');

const {processEvent} = require('./functions/proccessEvent');

const engine = require('./engine');
setInterval(async () => {
  await engine.engine();
}, 1000);

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

const redisUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_TLS_URL
    : process.env.REDIS_URL;

console.log('Redis URL:', redisUrl);

// Set up Redis connection
const redis = new ioredis(redisUrl, {
  ...(process.env.NODE_ENV === 'production' && {
    tls: {rejectUnauthorized: false},
  }),
  maxRetriesPerRequest: null, // Disable retry limit
});

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

// Listen for messages in the Redis queue
subscriber.on('message', async (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);

  if (channel === 'event-evaluation-queue') {
    await processEvent(message);
  }

  if (channel === 'event-projection-queue') {
    console.log('Projection task received:', message);
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

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
