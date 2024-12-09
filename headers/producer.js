import amqp from "amqplib";

const sendNotification = async (headers, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";
    const exchangeType = "headers";

    //in case of headers type the message will placed on the basis of headers type which is matched with queue headers

    //create a exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    //send data
    //routing key is ignored here ""
    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
      persistent: true,
      headers,
    }); //it does not support object

    console.log("message sent", JSON.stringify(message));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

sendNotification({ "x-match":"all","notification-type":"new-video","content-type":"video"},"new music video uploaded");
sendNotification({ "x-match":"all","notification-type":"live-streaming","content-type":"gaming"},"gaming live started");
sendNotification({ "x-match":"any","notification-type":"like","content-type":"vlog"},"new comment on your vlog");
sendNotification({ "x-match":"any","notification-type":"comment","content-type":"vlog"},"someone like your comment");
