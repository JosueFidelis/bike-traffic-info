const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
const {getAllRides, createRide} = require("./controllers/rideController");
const dbConnect = require('../config/db');

startDb();

amqp.connect("amqp://localhost", (error0, connection) => {
  checkForError(error0);
  startConsumer(connection);
});

async function startDb() {
  await dbConnect();
}

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
        console.log(" Nova ride recebida");
        createRide(msg.content.toString());
        //getAllRides().then(res => console.log(res));
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
