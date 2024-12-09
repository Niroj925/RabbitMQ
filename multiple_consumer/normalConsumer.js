import amqp from "amqplib";

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("normaluser_mail_queue",{durable:false});
    
     channel.consume("normaluser_mail_queue",(message)=>{
        if(message!==null){
        console.log('received normal message:',JSON.parse(message.content));
        //acknowledge the message after receive the message
        channel.ack(message);
        }
     });
  }catch(err){
    console.log(err);
  }
}

receiveMail();