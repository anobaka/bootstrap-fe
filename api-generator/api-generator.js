const swaggerGen = require('./swagger-vue');
const fs = require('fs');
const http = require('http');
const path = require('path');
// const https = require('https');

function generateSdk(swaggerJsonUrl, outputFile) {
  console.log(`generating sdk: ${swaggerJsonUrl}`);
  const dir = outputFile.substring(0, outputFile.lastIndexOf("\\") + 1);
  const requestInvoker = http;
  requestInvoker.get(swaggerJsonUrl, (response) => {
    const jsonFilename = path.join(dir, './swagger.json');
    const file = fs.createWriteStream(jsonFilename);
    const stream = response.pipe(file);
    stream.on('finish', () => {
      const jsonData = require(jsonFilename);
      const opt = {
        swagger: jsonData,
        moduleName: 'api',
        className: 'api'
      };
      let codeResult = swaggerGen(opt);
      fs.writeFileSync(outputFile, codeResult);
      console.log(`sdk generated: ${swaggerJsonUrl}`);
      fs.unlinkSync(jsonFilename);
    });
  });
}

module.exports = generateSdk;
