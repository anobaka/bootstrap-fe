const swaggerGen = require('./swagger-vue');
const fs = require('fs');
// const path = require('path');
const http = require('http');
// const https = require('https');

// const env = process.env.ENV || 'dev';

// let host = 'http://localhost:5000';

// // todo: api地址内网化
// switch (env.toLowerCase()) {
//   case 'pro':
//     break;
//   default:
//     break;
// }

// console.log(`generating sdk: ${host}/internal-doc/swagger/v1/swagger.json`);

export default function generateSdk(swaggerJsonUrl, outputFile) {
  console.log(`generating sdk: ${swaggerJsonUrl}`);
  const requestInvoker = http;
  requestInvoker.get(swaggerJsonUrl, (response) => {
    response.on('finish', body => {
      const opt = {
        swagger: body,
        moduleName: 'api',
        className: 'api'
      };
      let codeResult = swaggerGen(opt);
      fs.writeFileSync(outputFile, codeResult);
      console.log(`sdk generated: ${swaggerJsonUrl}`);
    });
  });
}