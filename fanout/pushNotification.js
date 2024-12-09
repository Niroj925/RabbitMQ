import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange="new_product_launch";
    const exchangeType="fanout";

    await channel.assertExchange(exchange,exchangeType,{durable:true});
    
    //this is the temporary queue which will delete after connection closed
   const queue=await channel.assertQueue("",{exclusive:true});

   console.log("waiting for msg:",queue);

    await channel.bindQueue(queue.queue,exchange,"");//bind the queue

    
     channel.consume(queue.queue,(message)=>{
        if(message!==null){
        console.log(`sending push notification received message:`,JSON.parse(message.content));
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
   
   
