import amqp from "amqplib";

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    const url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log(" RabbitMQ connected", url);
    return channel;
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};

export const assertQueue = async (queueName) => {
  const ch = getChannel();
  await ch.assertQueue(queueName, { durable: true });
};

export const consumeQueue = async (queueName, handler) => {
  const ch = getChannel();
  await assertQueue(queueName);
  ch.prefetch(10);
  await ch.consume(queueName, async (msg) => {
    if (!msg) return;
    const payload = JSON.parse(msg.content.toString());
    try {
      await handler(payload);
      ch.ack(msg);
    } catch (err) {
      console.error("Handler error, discarding message:", err);
      ch.nack(msg, false, false);
    }
  });
  console.log(` Listening on queue '${queueName}'`);
};