import { useEffect } from "react";

function Reciever() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "reciever" }));
    };

    let pc: RTCPeerConnection | null = null; // Declare it outside the onmessage callback

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "offer") {
        pc = new RTCPeerConnection();
        await pc.setRemoteDescription(data.sdp);
        const answer = await pc.createAnswer();

        pc.onicecandidate = (event) => {
          socket.send(
            JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
          );
        };

        pc.ontrack = (event) => {
          console.log(event);
          const video = document.createElement("video");
          document.body.appendChild(video);
          video.srcObject = new MediaStream([event.track]);
          video.play();
        };

        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", sdp: answer }));
      } else if (data.type === "iceCandidate") {
        console.log(pc);
        pc?.addIceCandidate(data.candidate);
      }
    };
  }, []);
  return <div>Reciever</div>;
}

export default Reciever;
