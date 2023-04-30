const fs = require('fs');
const csv = require('csv-parser');
const amqp = require('amqplib/callback_api');
const events = require('events');

const dirPath = './dataset-2022/';
const fileList = fs.readdirSync(dirPath);

const eventEmitter = new events.EventEmitter();

let ridesData = [];
let currentFileIndex = 0;
let currentRow = 0;

const readCsv = (file) => {
  console.log(`Lendo arquivo ${file}`);
  fs.createReadStream(dirPath + file)
    .pipe(csv())
    .on('data', (row) => {
      ridesData.push(row);
    })
    .on('end', () => {
      currentFileIndex++;
      if (currentFileIndex < fileList.length) {
        console.log(`Arquivo lido com sucesso. Lendo próximo arquivo.`);
        readCsv(fileList[currentFileIndex]);
      } else {
        console.log(`Todos os arquivos foram lidos.`);
      }
    });
}

const removeWhiteSpaceFromKeys = (obj) => {
  Object.keys(obj).forEach((key) => {
    var replacedKey = key.replace(/\s/g, "");
    if (key !== replacedKey) {
       obj[replacedKey] = obj[key];
       delete obj[key];
    }
 });
 return obj 
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queue = 'rides';

    channel.assertQueue(queue, {
      durable: true
    });
    setInterval(() => {
      if (currentRow >= ridesData.length) {
        readCsv(fileList[currentFileIndex])
        currentRow = 0;
      } else {
        rideToSend = removeWhiteSpaceFromKeys(ridesData[currentRow])
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(rideToSend)), {
          persistent: true
        });
        currentRow ++;
      }
    }, 1000);

    //console.log(" [x] Sent '%s'", ridesData[currentRow]);
  })
  eventEmitter.on('allFilesRead', () => {
    connection.close();
    process.exit(0);
  })
  /*setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);*/
});