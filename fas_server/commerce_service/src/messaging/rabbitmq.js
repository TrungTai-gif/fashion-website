// src/messaging/rabbitmq.js
import amqp from "amqplib";

let connection;
let channel;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE = process.env.PRODUCT_EXCHANGE || "product.events";
const EXCHANGE_TYPE = "topic";

export async function getChannel() {
  if (channel) return channel;
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });
  return channel;
}

export async function publishProductEvent(routingKey, payload) {
  const ch = await getChannel();
  const content = Buffer.from(JSON.stringify(payload));
  ch.publish(EXCHANGE, routingKey, content, {
    persistent: true,
    contentType: "application/json",
  });
}

export async function closeRabbit() {
  try {
    await channel?.close();
    await connection?.close();
  } catch {}
}

process.on("SIGTERM", closeRabbit);
process.on("SIGINT", closeRabbit);
