const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const amqp = require("amqplib/callback_api");
const http = require("http");
const mongoose = require("mongoose");
const {
  getAllRides,
  createRide,
  getTopStationNamesInLastHour,
  getStationFlowInLastHour,
} = require("./controllers/rideController");
const dbConnect = require("../config/db");
const EventEmitter = require("events").EventEmitter;
const emitter = new EventEmitter();

startDb();
let currTime = null;

amqp.connect("amqp://localhost", async (error0, connection) => {
  checkForError(error0);
  
  await createSSEServer();
  startConsumer(connection);
});

function createSSEServer () {
  let sseServer = http.createServer(function (req, res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    emitter.on("newRide", (topStations) => {
      console.log("Sent:"+ topStations.stations);
      res.write("data: " + topStations + "\n\n");
    });
  });
  sseServer.listen(9090);
  console.log("Started SSE Server")
};

const normalizeJsonData = (jsonString) => {
  let json = JSON.parse(jsonString);
  json.EndTime = new Date(json.EndTime);
  json.StartTime = new Date(json.StartTime);
  return json;
};

function startConsumer (connection) {
  connection.createChannel((error1, channel) => {
    checkForError(error1);

    let queue = "rides";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async (msg) => {
        console.log(" Nova ride recebida");
        let normalizedJson = normalizeJsonData(msg.content.toString());
        currTime = normalizedJson.EndTime;
        createRide(normalizedJson);

        let topArr = await getTopStationNamesInLastHour(currTime, 'StartStationName');
        let topDep = await getTopStationNamesInLastHour(currTime, 'EndStationName');

        let topStations = {
          "stations": [].concat(topArr, topDep)
        };
        emitter.emit("newRide", topStations);
        
        //await getStationFlowInLastHour(currTime,'EndStationName',getTopStationNamesInLastHour(currTime, 'EndStationName'))[0];
        //let aa = (await getTopStationNamesInLastHour(currTime, 'EndStationName'))[0];
        //await getStationFlowInLastHour(currTime,'EndStationName', aa); */
      },
      {
        noAck: true,
      }
    );

    console.log(" [*] Esperando pedidos na fila %s.", queue);
  });
};

const checkForError = (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
};

async function startDb() {
  await dbConnect();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log('listening to port 3333'));