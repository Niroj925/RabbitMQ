import amqp from "amqplib";

const announceNewProduct = async (message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType="fanout";

    //create a exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    //send data
    channel.publish(exchange,"", Buffer.from(JSON.stringify(message)),{persistent:true}); //it does not support object

    console.log("message sent", JSON.stringify(message));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

announceNewProduct({PId:742134,price:15000,name:'iphone pro max'});