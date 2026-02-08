import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

const TextChat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/room", msg => {
                setMessages(prev => [...prev, JSON.parse(msg.body)]);
            });
        });
    }, []);

    const send = () => {
        stompClient.send("/app/chat.send", { "content-type": "application/json" }, JSON.stringify({
            roomId: "1",
            user: "User1",
            text: text
        }));
        setText("");
    };

    return (
        <div>
            <h2>Chat</h2>
            <div style={{height: 300, overflow: "auto", border: "1px solid black"}}>
                {messages.map((m, i) => (
                    <div key={i}><b>{m.user}</b>: {m.text}</div>
                ))}
            </div>

            <input value={text} onChange={e => setText(e.target.value)} onKeyPress={event => {if(event.key === 'Enter'){send()}}}/>
            <button onClick={send}>Send</button>
        </div>
    );
}
export default TextChat;