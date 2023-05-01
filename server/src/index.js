const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const amqp = require("amqplib/callback_api");
const http = require("http");
const mongoose = require("mongoose");
const dbConnect = require("../config/db");
const EventEmitter = require("events").EventEmitter;
const sseEmitter = new EventEmitter();
const newRideEvent = "newRide";
const {
  getAllRides,
  createRide,
  getTopStationNamesInLastHour,
  getStationFlowInLastHour,
} = require("./controllers/rideController");

startDb();
amqp.connect("amqp://localhost", async (error0, connection) => {
  checkForError(error0);
  createSSEServer();
  startConsumer(connection);
});

const createSSEServer = () => {
  let sseServer = http.createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    sseEmitter.on(newRideEvent, (topStations) => {
      console.log(
        " [SSEServer] Sent top Departed Stations:\n" +
          topStations.stations.slice(0, 5) +
          "\nand top Arrived Stations:\n" +
          topStations.stations.slice(-5)
      );
      res.write("data: " + JSON.stringify(topStations) + "\n\n");
    });
  });
  sseServer.listen(9090);
  console.log(" [Started SSEServer]");
};

const normalizeJsonData = (jsonString) => {
  let json = JSON.parse(jsonString);
  json.EndTime = new Date(json.EndTime);
  json.StartTime = new Date(json.StartTime);

  return json;
};

const calcRideFlow = async (newRide) => {
  let currTime = newRide.EndTime;
  let topDep = await getTopStationNamesInLastHour(currTime, "StartStationName");
  let topArr = await getTopStationNamesInLastHour(currTime, "EndStationName");

  let topStations = { stations: [].concat(topDep, topArr) };

  return topStations;
};

const startConsumer = (connection) => {
  connection.createChannel((error1, channel) => {
    checkForError(error1);

    let queue = "rides";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async (msg) => {
        console.log(" [RabbitMQ] Nova ride recebida");
        let normalizedJson = normalizeJsonData(msg.content.toString());
        createRide(normalizedJson);

        let topStations = await calcRideFlow(normalizedJson);
        sseEmitter.emit(newRideEvent, topStations);
      },
      {
        noAck: true,
      }
    );

    console.log(" [RabbitMQ] Esperando pedidos na fila %s.", queue);
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

app.listen(3333, () => console.log("listening to port 3333"));
