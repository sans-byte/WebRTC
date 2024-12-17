import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sender from "./Sender";
import Reciever from "./Reciever";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender />}></Route>
        <Route path="/reciever" element={<Reciever />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
