const express = require('express');
const ioredis = require('ioredis');
const { generateEvaluation } = require('./services/evaluation');
const { getEventData, saveEvaluation } = require('./services/dbService');

const cors = require('cors');

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

const redisUrl = process.env.REDIS_URL;

console.log('Redis URL:', redisUrl);

// Set up Redis connection
const redis = new ioredis(redisUrl);

// Redis Pub/Sub
const subscriber = new ioredis();
const publisher = new ioredis();

// Subscribe to event-queue channel
subscriber.subscribe('event-evaluation-queue', async (err, count) => {
  if (err) {
    console.error('Error subscribing to Redis channel', err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s)`);
});

// Listen for messages in the Redis queue
subscriber.on('message', async (channel, message) => {
  const taskData = JSON.parse(message);
  const { eventId } = taskData;

  console.log('Received task for processing:', { eventId });

  try {
    // Assuming the event ID is used to fetch event data from a database (or any other source)
    const eventData = await getEventData(eventId); // Replace with your actual data fetching logic

    if (!eventData) {
      console.error('Event not found', { eventId });
      return;
    }

    console.log('Retrieved event data:', { eventData });

    // Call the evaluation function
    const evaluation = await generateEvaluation(eventData);

    console.log('Evaluation result:', { evaluation });

    // You can save the evaluation result back to your database or process it further here
    await saveEvaluation(eventId, evaluation); // Replace with actual DB saving logic
  } catch (error) {
    console.error('Error processing task', { eventId, error: error.message });
  }
});

// HTTP Endpoint to trigger task
app.post('/trigger-task', async (req, res) => {
  const { eventId } = req.body; // Extract from JSON payload

  if (!eventId) {
    return res.status(400).send('Missing eventId query parameter');
  }

  try {
    const message = { eventId };
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
