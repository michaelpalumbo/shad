// osc-server.js
const osc = require("osc");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });
let sockets = [];

wss.on("connection", (ws) => {
  sockets.push(ws);
  ws.on("close", () => {
    sockets = sockets.filter(s => s !== ws);
  });
});

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121
});

udpPort.on("message", function (oscMsg) {
  const jsonMsg = JSON.stringify(oscMsg);
  sockets.forEach(s => s.send(jsonMsg));
});

udpPort.open();
console.log("OSC WebSocket bridge running on ws://localhost:8081");
