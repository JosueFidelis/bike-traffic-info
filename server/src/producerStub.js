const amqp = require("amqplib/callback_api");
const fs = require("fs");

amqp.connect("amqp://localhost", function (error0, connection) {
  checkForError(error0);
  startPublisher(connection);
});

function startPublisher(connection) {
  connection.createChannel(function (error1, channel) {
    checkForError(error1);
    let msg;
    try {
      msg = fs.readFileSync("dataStub.json", "utf8");
      console.log("dataStub.json foi lido com sucesso");
    } catch (err) {
      console.error(err);
    }


    let queue = "rides";
    channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(" Bike Ride enviada:\n%s", msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
}

function checkForError(err) {
  if (err) {
    console.error(err);
    throw err;
  }
}
