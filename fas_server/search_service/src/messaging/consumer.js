// src/messaging/consumer.js
import amqp from "amqplib";
import { esClient, ES_INDEX } from "../config/es.js";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const EXCHANGE = process.env.PRODUCT_EXCHANGE || "product.events";

export async function startProductConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  const q = await channel.assertQueue("search_service_products", {
    durable: true,
  });

  // Bind keys
  await channel.bindQueue(q.queue, EXCHANGE, "product.created");
  await channel.bindQueue(q.queue, EXCHANGE, "product.updated");
  await channel.bindQueue(q.queue, EXCHANGE, "product.deleted");

  channel.prefetch(5);

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const key = msg.fields.routingKey;
      const payload = JSON.parse(msg.content.toString());
      if (key === "product.created" || key === "product.updated") {
        const id = String(payload.id || payload._id);
        if (!id) throw new Error("Missing id in payload");
        await esClient.index({
          index: ES_INDEX,
          id,
          document: payload,
          refresh: "wait_for",
        });
      } else if (key === "product.deleted") {
        const id = String(payload.id || payload._id);
        if (id) {
          try {
            await esClient.delete({ index: ES_INDEX, id, refresh: "wait_for" });
          } catch (e) {}
        }
      }
      channel.ack(msg);
    } catch (err) {
      console.error("Consumer error:", err.message);
      channel.nack(msg, false, false); // drop or route to DLQ in future
    }
  });

  console.log("✓ RabbitMQ consumer started for product events");

  const cleanup = async () => {
    try {
      await channel.close();
      await connection.close();
    } catch {}
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}
