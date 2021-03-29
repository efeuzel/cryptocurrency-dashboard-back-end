import { server as WebSocketServer } from "websocket";
import http from "http";

var server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  console.log("Request origin is: ", origin);
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  var connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", messageHandler);

  //start sending messages as soon as connection is created
  /*let val = 0;
  setInterval(() => {
    const message = { name: "Bittrex_BTC/TRY", bid: val++ };
    connection.sendUTF(JSON.stringify(message));
    val = val + 1;
  }, 1000);*/

  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});

// message that comes from browser, we need to start sending out updates.
const messageHandler = (message) => {
  if (message.type === "utf8") {
    console.log("Received Message: " + message.utf8Data);
  }
};

export default wsServer;
