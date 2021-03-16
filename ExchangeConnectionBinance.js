var WebSocketClient = require("websocket").client;

var client = new WebSocketClient();

client.on("connectFailed", function (error) {
  console.log("Connect Error: " + error.toString());
});

client.on("connect", function (connection) {
  console.log("WebSocket Client Connected");
  connection.on("error", function (error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on("close", function () {
    console.log("echo-protocol Connection Closed");
  });
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });

  if (connection.connected) {
    const subscribeMessage = {
      method: "SUBSCRIBE",
      params: ["btcusdt@ticker"],
      id: 1,
    };
    connection.sendUTF(JSON.stringify(subscribeMessage));
  }
});

//TODO: Reconnect at every 24 hours, send pong every 10 mins
client.connect("wss://stream.binance.com:9443/ws");
