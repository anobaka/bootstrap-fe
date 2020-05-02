const swaggerGen = require("./swagger-gen"), fs = require("fs"), http = require("http"), https = require("https"), path = require("path");
// const https = require('https');

function generateSdk(swaggerJsonUrl, outputDir) {
  console.log(`Generating SDK: ${swaggerJsonUrl}`);
  // console.log(`outputFile: ${outputFile}`);
  // const dir = outputFile.substring(0, outputFile.lastIndexOf(path.sep) + 1);
  // console.log(`dir: ${dir}`)
  const requestInvoker = swaggerJsonUrl.startsWith("https") ? https : http;
  requestInvoker.get(swaggerJsonUrl, response => {
    const jsonFilename = path.join(outputDir, "./swagger.json");
    const file = fs.createWriteStream(jsonFilename);
    const stream = response.pipe(file);
    stream.on("finish", () => {
      // console.log(`jsonFilename: ${jsonFilename}`)
      const jsonData = require(jsonFilename);
      const opt = {
        swagger: jsonData,
        moduleName: "api",
        className: "api"
      };
      let outputs = swaggerGen(opt);
      Object.keys(outputs).map(f => {
        const o = outputs[f];
        const { override, data } = o;
        const filename = path.join(outputDir, f + ".js");
        if (override || !fs.existsSync(filename)) {
          fs.writeFileSync(filename, data);
          console.log(`File generated: ${filename}`);
        }
      });
      fs.unlinkSync(jsonFilename);
      console.log(`SDK generated: ${swaggerJsonUrl}`);
    });
  });
}

module.exports = generateSdk;
