import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  function sendMessage() {
    socket.emit("send_message", { message, userId: "1234" });
    setMessage("");
  }

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("receive_message", (data) => {
      console.log("data:", data);
      try {
        // Update state using functional form to ensure previous state is used
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } catch (error) {
        console.error("Error handling received message:", error);
      }
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off("connect_error");
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div>
      <div>
        Message:{" "}
        {messages.map((data, i) => (
          <h5 key={i}>{data}</h5>
        ))}
      </div>
      <div className="App">
        <input
          placeholder="Message"
          value={message}
          onChange={({ target }) => setMessage(target.value)}
        />
        <button type="button" onClick={sendMessage}>
          Send message
        </button>
      </div>
    </div>
  );
};

export default App;
