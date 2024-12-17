import { WebSocket, WebSocketServer } from "ws";

let wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let recieverSocket: null | WebSocket = null;

//SDP -> session description protocol

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type == "sender") {
      senderSocket = ws;
      console.log("sender");
    } else if (message.type === "reciever") {
      recieverSocket = ws;
      console.log("reciever");
    } else if (message.type === "offer") {
      recieverSocket?.send(JSON.stringify({ type: "offer", sdp: message.sdp }));
      console.log("offer");
    } else if (message.type === "answer") {
      senderSocket?.send(JSON.stringify({ type: "answer", sdp: message.sdp }));
      console.log("answer");
    } else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        recieverSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      } else if (ws === recieverSocket) {
        senderSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      }
    } else {
      console.log("Here");
    }
  });

  // we need to suppport 5 messages here
  // identify-as-sender
  // identify-as-reciever
  // create offer
  // create answer
  // Add Ice Candidate
});
