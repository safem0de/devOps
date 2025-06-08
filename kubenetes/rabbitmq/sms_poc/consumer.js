require('dotenv').config();
const amqp = require('amqplib');

async function consumeMessages() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'sms_queue';

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log(`Received: ${data.id} - ${data.phone_number}`);

      // จำลองการส่ง SMS
      const isSent = await sendSmsMock(data.phone_number, data.message);

      if (isSent) {
        console.log(`SMS sent successfully for ID: ${data.id}`);
      } else {
        console.log(`Failed to send SMS for ID: ${data.id}`);
      }

      // แจ้ง RabbitMQ ว่า consume เสร็จ (ack)
      channel.ack(msg);
    }
  });
}

async function sendSmsMock(phone, message) {
  console.log(`Sending SMS to ${phone}: "${message}"`);
  // จำลอง delay
  await new Promise((r) => setTimeout(r, 1000));
  // จำลองว่าส่งสำเร็จเสมอ
  return true;
}

consumeMessages().catch(console.error);
