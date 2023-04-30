const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
const Ride = require("./models/Ride");

amqp.connect("amqp://localhost", function (error0, connection) {
  checkForError(error0);
  mongoose
    .connect("mongodb://localhost:27017/test")
    .then((res) => {
      console.log("MongoDB successfully connected");
      startConsumer(connection);
    })
    .catch((err) => {
      console.log(err);
    });
});

function startConsumer(connection) {
  connection.createChannel(function (error1, channel) {
    checkForError(error1);

    let queue = "rides";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async function (msg) {
        console.log(" Novo pedido recebido: %s", msg.content.toString());
        let newRide = JSON.parse(msg.content.toString());
        delete newRide["User Type"]; 
        const ride = new Ride(newRide);
        await ride.save();
      },
      {
        noAck: true,
      }
    );

    console.log(" [*] Esperando pedidos na fila %s.", queue);
  });
}

function checkForError(err) {
  if (err) {
    console.error(err);
    throw err;
  }
}
