import { useEffect, useState } from "react";
import { socket } from "./socket";

const Chat = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("chat-message", (msg : string) => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("chat-message", { roomId, message: text });
    setMessages(prev => [...prev, text]);
    setText("");
  };

  return (
    <div>
      <h4>Chat</h4>
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
