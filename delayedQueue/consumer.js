import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "delayed-order-updated-queue";

    // Assert the queue (durable to ensure persistence)
    await channel.assertQueue(queue, { durable: true });

    console.log("Waiting for batches...");

    channel.consume(
      queue,
      async (batch) => {
        if (batch !== null) {
          const { batchId } = JSON.parse(batch.content.toString());
          console.log(`Processing update for batchId: ${batchId}`);
          // Acknowledge the batch after processing
          await updateOrderStatus(batchId);
          channel.ack(batch);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Error in consumer:", err);
  }
};

function updateOrderStatus(batchId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Order status updated:", batchId);
      resolve();
    }, 500);
  });
}

receiveMail();
