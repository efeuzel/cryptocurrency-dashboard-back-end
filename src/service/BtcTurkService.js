import Client from "websocket";
import wsServer from "../api/WebsocketServer.js";

export default class BtcTurkService {
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
      //console.log("Received: '" + message.utf8Data + "'");
      const parsedMessage = JSON.parse(message.utf8Data);
      if (parsedMessage[0] === 431) {
        //Ticker messages
        this.tickerHandler.handleTicker(
          "BtcTurk",
          parsedMessage[1].PS,
          parsedMessage[1].BO[0].P,
          parsedMessage[1].BO[0].A,
          parsedMessage[1].AO[0].P,
          parsedMessage[1].AO[0].A
        );
        //send to front end
        if (wsServer.connections[0])
          wsServer.connections[0].sendUTF(
            JSON.stringify({
              name: "BtcTurk_" + parsedMessage[1].PS,
              bid: parsedMessage[1].BO[0].P,
            })
          );
      }
    }
  }

  subscribeTo(ticker) {
    const subscribeMessage = [
      151,
      {
        type: 151,
        channel: "orderbook",
        event: ticker,
        join: true,
      },
    ];
    this.connection.sendUTF(JSON.stringify(subscribeMessage));
  }
}
