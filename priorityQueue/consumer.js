import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "priority_queue";

    // Assert queue with priority enabled
    await channel.assertQueue(queue, { durable: true, arguments: { "x-max-priority": 10 } });

    console.log("Waiting for new messages...");

    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log("Received message:", message.content.toString());
        // Simulate processing time
        setTimeout(() => {
          channel.ack(message);
        }, 1000); // Process each message after 1 second
      }
    });
  } catch (err) {
    console.error("Error in consumer:", err);
  }
};

receiveMail();
