import { useEffect } from "react";

function Reciever() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "reciever" }));
    };
  }, []);
  return <div>Reciever</div>;
}

export default Reciever;
