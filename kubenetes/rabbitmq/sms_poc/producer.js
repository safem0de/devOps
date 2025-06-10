require('dotenv').config();
const amqp = require('amqplib');
const { pushLogToLoki } = require('./lokiLogger');

async function sendMessages() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'sms_queue';

  await channel.assertQueue(queue, { durable: true });

  // ตัวอย่าง mock data (จำลองการอ่านจาก DB)
  const mockData = [
    { id: 1, phone_number: '0812345678', message: 'ยืนยัน invoice : 123456' },
    { id: 2, phone_number: '0898765432', message: 'ยืนยัน invoice : 111111' },
    { id: 3, phone_number: '0855555555', message: 'ยืนยัน invoice : 246810' }
  ];

  for (const row of mockData) {
    const msg = JSON.stringify(row);
    // ส่งไป RabbitMQ
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(`Sent: ${msg}`);
    // ส่ง log เข้า Loki
    await pushLogToLoki(JSON.stringify(row));
  }

  setTimeout(() => {
    connection.close();
  }, 500);
}

sendMessages().catch(console.error);
