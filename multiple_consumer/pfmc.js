import amqp from "amqplib";

const sendMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange";
    const routingKeySubsUser = "send_mail_subs_user";
    const routingKeyNormalUser = "send_mail_normal_user";
    //create a object which will sent
    const message = {
      to: "normal@gmail.com",
      from: "niro@gmail.com",
      subject: "Greet",
      body: "Namaste Normal user",
    };

    //create a exchange
    await channel.assertExchange(exchange, "direct", { durable: false });

    //create a queue
    await channel.assertQueue("subsuser_mail_queue", { durable: false }); 
    await channel.assertQueue("normaluser_mail_queue", { durable: false });

    //bind exchange and queue with the help of routing key
    await channel.bindQueue("subsuser_mail_queue", exchange, routingKeySubsUser);
    await channel.bindQueue("normaluser_mail_queue", exchange, routingKeyNormalUser);
    //send data
    channel.publish(exchange, routingKeySubsUser, Buffer.from(JSON.stringify(message))); 
    // channel.publish(exchange, routingKeyNormalUser, Buffer.from(JSON.stringify(message)));
    
    console.log("message sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMail();
