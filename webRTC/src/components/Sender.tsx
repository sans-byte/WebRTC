import { useEffect, useState } from "react";

function Sender() {
  const [socket, setSocket] = useState<null | WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
    setSocket(socket);
  }, []);

  async function sendVideo() {
    if (!socket) return;
    const pc: RTCPeerConnection = new RTCPeerConnection();

    pc.onnegotiationneeded = async () => {
      console.log("onnegotiationneeded");
      const offer = await pc.createOffer(); //this will give you SDP the thing which you will need to send to other side
      await pc.setLocalDescription(offer);
      socket.send(JSON.stringify({ type: "offer", sdp: pc.localDescription })); // or pc.localdescription can also be used as they contains
      // the same thing
    };

    pc.onicecandidate = (event) => {
      socket.send(
        JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "answer") {
        pc.setRemoteDescription(data.sdp);
      } else if (data.type === "iceCandidate") {
        pc.addIceCandidate(data.candidate);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    pc.addTrack(stream.getVideoTracks()[0]);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          margin: 0,
          padding: 0,
          gap: "2em",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div> Send Video </div>
        <button onClick={sendVideo}> Sender </button>
      </div>
    </>
  );
}

export default Sender;
