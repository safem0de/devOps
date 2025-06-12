require("dotenv").config();
const axios = require('axios');

/**
 * pushLogToLoki - ส่ง log เข้า Loki
 * @param {string} log - log message
 */
async function pushLogToLoki(log) {
  const payload = {
    streams: [
      {
        stream: { app: 'rabbitmq-producer' },
        values: [[ `${Date.now()}000000`, log ]]
      }
    ]
  };

  try {
    await axios.post(process.env.LOKI_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Sent log to Loki');
  } catch (error) {
    console.error('Error pushing log to Loki:', error.response ? error.response.data : error.message);
  }
}

module.exports = { pushLogToLoki };
