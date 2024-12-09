import amqp from "amqplib";

const sentTODelayedQueue = async (batchId, orders, delayed) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "delayed_exchange";
    const queue = "delayed-order-updated-queue";

    // Create the exchange of type x-delayed-message
    await channel.assertExchange(exchange, "x-delayed-message", {
      durable: true,
      arguments: { "x-delayed-type": "direct" },
    });

    // Create the queue
    await channel.assertQueue(queue, { durable: true });

    // Bind the exchange and the queue with a routing key
    await channel.bindQueue(queue, exchange, "");

    // Prepare the message payload
    const message = JSON.stringify({ batchId, orders });

    // Publish the message with the specified delay
    channel.publish(exchange, "", Buffer.from(message), {
      headers: { "x-delay": delayed },
    });

    console.log(`Sent batch ${batchId} update order with delay ${delayed}ms`);

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("Error in producer:", err);
  }
};

// Simulating order processing and message sending
async function processBatchOrders() {
  const batchId = generateBatchId();
  const orders = [
    {orderId:4214,item:"laptop",quantity:5},
    {orderId:5424,item:"samsung",quantity:2},
    {orderId:4214,item:"watch",quantity:3}
];
  const delayed = 5000; // 5 seconds delay

  await sentTODelayedQueue(batchId, orders, delayed);
}

// Utility function to generate a unique batch ID
function generateBatchId() {
  return `batch-${Math.floor(Math.random() * 10000)}`;
}

// Call the function to simulate message production
processBatchOrders();
