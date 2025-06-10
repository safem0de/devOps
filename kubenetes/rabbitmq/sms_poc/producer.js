require('dotenv').config();
const amqp = require('amqplib');
const axios = require('axios');

async function pushLogToLoki(log) {
  const payload = {
    streams: [
      {
        stream: { job: 'rabbitmq-producer' },
        values: [[ `${Date.now()}000000`, log ]]
      }
    ]
  };
  await axios.post('http://localhost:3100/loki/api/v1/push', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
}

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
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(`Sent: ${msg}`);
    await pushLogToLoki(JSON.stringify(row));
  }

  setTimeout(() => {
    connection.close();
  }, 500);
}

sendMessages().catch(console.error);
