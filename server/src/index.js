const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
const {getAllRides, createRide, getTopStationNamesInLastHour, getStationFlowInLastHour} = require("./controllers/rideController");
const dbConnect = require('../config/db');

startDb();
let currTime = null;

amqp.connect("amqp://localhost", (error0, connection) => {
  checkForError(error0);
  startConsumer(connection);
});

const normalizeJsonData = (jsonString) => {
  let json = JSON.parse(jsonString);
  json.EndTime = new Date(json.EndTime);
  json.StartTime = new Date(json.StartTime);
  return json;
}

const startConsumer = (connection) => {
  connection.createChannel((error1, channel) => {
    checkForError(error1);

    let queue = "rides";
    let msgContent = '';

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async (msg) => {
        console.log(" Nova ride recebida");
        let normalizedJson = normalizeJsonData(msg.content.toString())
        currTime = normalizedJson.EndTime;
        createRide(normalizedJson);
        //await getStationFlowInLastHour(currTime,'EndStationName',getTopStationNamesInLastHour(currTime, 'EndStationName'))[0];
        //let aa = (await getTopStationNamesInLastHour(currTime, 'EndStationName'))[0];
        //await getStationFlowInLastHour(currTime,'EndStationName', aa);
      },
      {
        noAck: true,
      }
    );

    console.log(" [*] Esperando pedidos na fila %s.", queue);
  });
}

const checkForError = (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
}

async function startDb () {
  await dbConnect();
}
