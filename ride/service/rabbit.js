const amqp = require("amqplib");

const RabbitMQ = process.env.AMQ_URL;
let channel = null, connection = null;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(RabbitMQ);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      setTimeout(connectRabbitMQ, 1000); // Reconnect after 1 second
    });

    // Handle connection close
    connection.on('close', () => {
      console.error('RabbitMQ connection closed');
      setTimeout(connectRabbitMQ, 1000); // Reconnect after 1 second
    });

  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    setTimeout(connectRabbitMQ, 1000); // Retry connection after 1 second
  }
}

async function publishToQueue(queueName, message) {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to queue ${queueName}`);
  } catch (error) {
    console.error("Failed to publish message", error);
  }
}

async function subscribeToQueue(queueName, callback) {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        channel.ack(msg);
      }
    });
    console.log(`Subscribed to queue ${queueName}`);
  } catch (error) {
    console.error("Failed to subscribe to queue", error);
  }
}

module.exports = {
  publishToQueue,
  subscribeToQueue,
  connectRabbitMQ
};