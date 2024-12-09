import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange="notification_exchange";
    const queue="payment_queue";

    await channel.assertExchange(exchange,"topic",{durable:true});
    await channel.assertQueue(queue,{durable:true});

    await channel.bindQueue(queue,exchange,"payment.*");
    console.log('waiting for msg');

     channel.consume(queue,(message)=>{
        if(message!==null){
        console.log('[payment notification] received message:',JSON.parse(message.content));
        //acknowledge the message after receive the message
        channel.ack(message);
        }
     },
     {noAck:false}
    );
  }catch(err){
    console.log(err);
  }
}

receiveMail();