import Client from "websocket";

export default class BinanceService {
  constructor(websocketURL, tickerHandler) {
    this.websocketURL = websocketURL;
    this.tickerHandler = tickerHandler;

    this.setUpConnection = this.setUpConnection.bind(this);
    this.subscribeTo = this.subscribeTo.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
  }

  connectToServer() {
    const WebSocketClient = Client.client;

    this.client = new WebSocketClient();

    this.client.on("connectFailed", function (error) {
      console.log("Connect Error: " + error.toString());
    });

    this.client.on("connect", this.setUpConnection);

    //TODO: Reconnect at every 24 hours, send pong every 10 mins
    this.client.connect(this.websocketURL);
  }

  setUpConnection(connection) {
    console.log("WebSocket Client Connected");
    connection.on("error", function (error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on("close", function () {
      console.log("echo-protocol Connection Closed");
    });
    connection.on("message", this.messageHandler);

    this.connection = connection;
  }

  messageHandler(message) {
    if (message.type === "utf8") {
      console.log("Received: '" + message.utf8Data + "'");
      const parsedMessage = JSON.parse(message.utf8Data);
      //Ticker messages
      this.tickerHandler.handleTicker(
        "Binance",
        parsedMessage.s,
        parsedMessage.b,
        parsedMessage.B,
        parsedMessage.a,
        parsedMessage.A
      );
    }
  }

  subscribeTo(ticker) {
    const subscribeMessage = {
      method: "SUBSCRIBE",
      params: [ticker.toLowerCase().concat("@bookTicker")],
      id: 1,
    };
    this.connection.sendUTF(JSON.stringify(subscribeMessage));
  }
}
