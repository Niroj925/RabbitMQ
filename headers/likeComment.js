import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange="header_exchange";
    const exchangeType="headers";

    await channel.assertExchange(exchange,exchangeType,{durable:true});
    
    //this is the temporary queue which will delete after connection closed
   const q=await channel.assertQueue("",{exclusive:true});

   console.log("waiting any new like or commment notification");

   //this defines which type of message accept if match the condition then it push into the queue
    await channel.bindQueue(q.queue,exchange,"",{
        "x-match":"any",
        "notification-type":"like",
        "content-type":"vlog"
    });//here any meany any of the headers type in notification type and content-type andy one match then push into the queue

     channel.consume(q.queue,(message)=>{
        if(message!==null){
          const product=JSON.parse(message.content)
        console.log(`receives new like or comment notification:`,product);
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
   
   
