import http from 'http';

const BACKEND_URL = 'localhost';
const BACKEND_PORT = 8001;
const HEALTH_PATH = '/api/health';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 2000;

function checkHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BACKEND_URL,
      port: BACKEND_PORT,
      path: HEALTH_PATH,
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Status code: ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function waitForBackend() {
  console.log('⏳ Waiting for backend to start...');
  console.log(`   Target: http://${BACKEND_URL}:${BACKEND_PORT}${HEALTH_PATH}`);

  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      await checkHealth();
      console.log('✅ Backend is ready!');
      process.exit(0);
    } catch (err) {
      process.stdout.write(`   [${i}/${MAX_RETRIES}] Backend not ready yet... `);
      if (i < MAX_RETRIES) {
        process.stdout.write(`retrying in ${RETRY_INTERVAL / 1000}s\r`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        process.stdout.write('\n');
        console.log('❌ Backend failed to start within timeout period');
        console.log(`   Please check backend logs for errors`);
        process.exit(1);
      }
    }
  }
}

waitForBackend();
