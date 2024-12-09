import amqp from "amqplib";

const sendMail = async (routingKey,message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType="topic";

    //create a exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    //send data
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)),{persistent:true}); //it does not support object

    console.log("message sent", JSON.stringify(message));
    console.log(`Message send with routing key ${routingKey}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendMail('order.placed',{orderId:742134,status:"placed"});
sendMail('payment.processed',{orderId:85334,status:"processed"})