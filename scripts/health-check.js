import http from 'http';

const services = [
  {
    name: 'Backend API',
    host: 'localhost',
    port: 8001,
    path: '/api/health',
  },
  {
    name: 'Frontend Dev Server',
    host: 'localhost',
    port: 5179,
    path: '/',
  },
];

function checkService(service) {
  return new Promise((resolve) => {
    const options = {
      hostname: service.host,
      port: service.port,
      path: service.path,
      method: 'GET',
      timeout: 3000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ ...service, status: 'ok', statusCode: res.statusCode });
      } else {
        resolve({ ...service, status: 'error', statusCode: res.statusCode });
      }
    });

    req.on('error', () => {
      resolve({ ...service, status: 'down' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ...service, status: 'timeout' });
    });

    req.end();
  });
}

async function healthCheck() {
  console.log('🔍 Running health check for all services...\n');

  const results = await Promise.all(services.map(checkService));

  let allOk = true;

  results.forEach((result) => {
    const url = `http://${result.host}:${result.port}${result.path}`;

    switch (result.status) {
      case 'ok':
        console.log(`✅ ${result.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${result.statusCode}`);
        break;
      case 'error':
        console.log(`⚠️  ${result.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${result.statusCode} (unexpected response)`);
        allOk = false;
        break;
      case 'down':
        console.log(`❌ ${result.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: Service is not running`);
        allOk = false;
        break;
      case 'timeout':
        console.log(`⏱️  ${result.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: Connection timeout`);
        allOk = false;
        break;
    }
    console.log('');
  });

  if (allOk) {
    console.log('🎉 All services are running and healthy!');
    console.log('');
    console.log('📋 Quick links:');
    console.log('   Frontend: http://localhost:5179');
    console.log('   Backend API: http://localhost:8001/api/health');
    console.log('   API Docs: http://localhost:8001/docs');
    process.exit(0);
  } else {
    console.log('⚠️  Some services are not ready. Please check the status above.');
    process.exit(1);
  }
}

healthCheck();
