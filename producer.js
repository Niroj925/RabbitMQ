import amqp from "amqplib";

const sendMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange";
    const routingKey = "send_mail";

    //create a object which will sent
    const message = {
      to: "test@gmail.com",
      from: "niro@gmail.com",
      subject: "Greet",
      body: "Namaste World",
    };

    //create a exchange
    await channel.assertExchange(exchange, "direct", { durable: false });

    //create a queue
    await channel.assertQueue("mail_queue", { durable: false });

    //bind exchange and queue with the help of routing key
    await channel.bindQueue("mail_queue", exchange, routingKey);

    //send data
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message))); //it does not support object

    console.log("message sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMail();
