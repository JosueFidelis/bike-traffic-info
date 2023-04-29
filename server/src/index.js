const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error0, connection) {
  checkForError(error0);
  startConsumer(connection);
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
      function (msg) {
        console.log(" Novo pedido recebido: %s", msg.content.toString());
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
