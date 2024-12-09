import amqp from "amqplib";

const sendMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "priority_exchange";
    const routingKey = "priority_key";
    const queue = "priority_queue";

    // Create an exchange
    await channel.assertExchange(exchange, "direct", { durable: true });

    // Create a queue with priority enabled
    await channel.assertQueue(queue, { durable: true, arguments: { "x-max-priority": 10 } });

    // Bind exchange and queue
    await channel.bindQueue(queue, exchange, routingKey);

    const data = [
      { msg: "Namaste Nepal", priority: 5 },
      { msg: "Hamro Nepal", priority: 3 },
      { msg: "Ramro Nepal", priority: 7 },
    ];

    // Publish messages with priority
    data.forEach((message) => {
      channel.publish(exchange, routingKey, Buffer.from(message.msg), { priority: message.priority });
    });

    console.log("All messages sent");

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error in producer:", err);
  }
};

sendMail();
