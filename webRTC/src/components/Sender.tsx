import { useEffect, useState } from "react";

function Sender() {
  const [socket, setSocket] = useState<null | WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
  }, []);

  async function sendVideo() {
    const pc: RTCPeerConnection = new RTCPeerConnection();
    const offer = await pc.createOffer(); //this will give you SDP the thing which you will need to send to other side
    await pc.setLocalDescription(offer);
    socket?.send(JSON.stringify({ type: "offer", sdp: offer })); // or pc.localdescription can also be used as they contains the same thing
  }

  return (
    <div>
      <button onClick={sendVideo}></button>
    </div>
  );
}

export default Sender;
