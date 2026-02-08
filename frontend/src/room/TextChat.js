import {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

const TextChat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const clientRef = useRef(null);


    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => {
                client.subscribe("/topic/room", msg => {
                    setMessages(prev => [...prev, JSON.parse(msg.body)]);
                });
            }
        });
        client.activate()
        clientRef.current = client;
        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, []);

    const send = () => {
        if (!clientRef.current || !clientRef.current.connected) return;

        clientRef.current.publish({
            destination: "/app/chat.send",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                roomId: 1,
                userId: 1,
                text
            })
        });
        setText("");
    };

    return (
        <div>
            <h2>Chat</h2>
            <div style={{height: 300, overflow: "auto", border: "1px solid black"}}>
                {messages.map((m, i) => (
                    <div key={i}><b>{m.author}({m.created_at.time})</b>: {m.text}</div>
                ))}
            </div>

            <input value={text} onChange={e => setText(e.target.value)} onKeyPress={event => {if(event.key === 'Enter'){send()}}}/>
            <button onClick={send}>Send</button>
        </div>
    );
}
export default TextChat;