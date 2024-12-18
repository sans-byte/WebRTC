import { useEffect, useRef } from "react";

function Reciever() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "reciever" }));
    };

    let pc: RTCPeerConnection | null = null; // Declare it outside the onmessage callback

    socket.onmessage = async (event) => {
      const data = await JSON.parse(event.data);
      if (data.type === "offer") {
        pc = new RTCPeerConnection();

        pc.ontrack = async (event) => {
          console.log(event);
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
            // videoRef.current.controls = true;
            videoRef.current.autoplay = true;
            try {
              await videoRef.current.play();
            } catch (error) {
              console.log(error);
            }
          }
          // console.log(event);
          // const video = document.createElement("video");
          // document.body.appendChild(video);
          // video.controls = true;
          // video.srcObject = event.streams[0];
          // await video.play();
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();

        pc.onicecandidate = (event) => {
          console.log(event);
          socket.send(
            JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
          );
        };

        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", sdp: answer }));

        console.log(pc);
      } else if (data.type === "iceCandidate") {
        console.log(pc);
        await pc?.addIceCandidate(data.candidate);
      }
    };
  }, []);
  return (
    <div>
      Reciever
      <div>
        <video ref={videoRef} autoPlay></video>
        <button onClick={() => videoRef.current?.play()}> click me</button>
      </div>
    </div>
  );
}

export default Reciever;
