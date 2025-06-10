require("dotenv").config();
const amqp = require("amqplib");
const { pushLogToLoki } = require('./lokiLogger');

async function consumeMessages() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = "sms_queue";

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log(`Received: ${data.id} - ${data.phone_number}`);

      const isSent = await sendSmsMock(data.phone_number, data.message);

      if (isSent) {
        console.log(`SMS sent successfully for ID: ${data.id}`);
        channel.ack(msg); // ถ้าสำเร็จ → ack

        await pushLogToLoki(`SMS sent successfully for ID: ${data.id}`);
      } else {
        console.log(
          `SMS failed for ID: ${data.id} → Will not ack, so RabbitMQ will retry.`
        );
        // **ไม่ ack** → RabbitMQ จะ requeue (retry)
        // channel.nack(msg, false, true); // หรือใช้ nack(requeue=true)
        await pushLogToLoki(
          `SMS failed for ID: ${data.id} → Will not ack, so RabbitMQ will retry.`
        );
      }
    }
  });
}

async function sendSmsMock(phone, message) {
  console.log(`Sending SMS to ${phone}: "${message}"`);

  // จำลอง delay
  await new Promise((r) => setTimeout(r, 1000));

  /* จำลองว่า fail ถ้าเบอร์ลงท้ายด้วยเลขคี่ (comment เพื่อให้ Simulation success) */
  // if (parseInt(phone.slice(-1)) % 2 !== 0) {
  //   console.log(`Mock SMS FAILED for ${phone}`);
  //   return false; // Fail
  // }

  console.log(`Mock SMS SUCCESS for ${phone}`);
  return true; // Success
}

consumeMessages().catch(console.error);
