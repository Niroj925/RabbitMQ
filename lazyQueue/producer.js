import amqp from "amqplib";

const setUp = async (message) => {

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "lazy_notification_exchange";
    const routingKey = "lazy_notification_queue";
    const queue = "lazy_queue";

    //create a exchange
    await channel.assertExchange(exchange, "direct", { durable: true });

    //create a queue
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-mode": "lazy",
      },
    });

    //bind exchange and queue with the help of routing key
    await channel.bindQueue(queue, exchange, routingKey);

    //send data
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)),{persistent:true}); //it does not support object

    console.log("message sent", message);
   
    await channel.close();

    await connection.close();
  
};
setUp("Hello Nepal")
