import {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

const TextChat = (props) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const clientRef = useRef(null);
    const bottomRef = useRef(null);


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
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const send = () => {
        if (!clientRef.current || !clientRef.current.connected) return;

        clientRef.current.publish({
            destination: "/app/chat.send",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                roomId: "ebd009f1-ad4b-4709-a8e0-d9482edc0628",
                userId: props.prid,
                text
            })
        });
        setText("");
    };

    return (
        <div className="chat-area">
            <h2>Chat</h2>
            <div className="messages">
                {messages.map((m, i) => (
                    <div key={i}><b>{m.author}({m.created_at.time})</b>: {m.text}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="sender">
                <input value={text} onChange={e => setText(e.target.value)} onKeyPress={event => {
                    if (event.key === 'Enter') {
                        send()
                    }
                }} placeholder="Write Message..."/>
                <button onClick={send}>Send</button>
            </div>
        </div>
    );
}
export default TextChat;