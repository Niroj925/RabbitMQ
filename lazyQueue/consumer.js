import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "lazy_queue";

    
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-mode": "lazy",
      },
    });
    
    console.log("waitinng for a new message");

    channel.consume(queue, (message) => {
      if (message !== null) {
        console.log("received message:", JSON.parse(message.content));
        //acknowledge the message after receive the message
        channel.ack(message);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

receiveMail();
