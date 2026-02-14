import {useEffect, useRef, useState} from "react";
import {useWS} from "./services/WebSocketContext";

const TextChat = (props) => {
    const {subscribe, send} = useWS();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);


    useEffect(() => {
        const sub = subscribe(`/topic/room/${props.roomId}/chat`, (msg) => {
            const chat = JSON.parse(msg.body);
            setMessages((prev) => [...prev, chat]);
        });

        return () => sub?.unsubscribe();
    }, [subscribe, props]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim()) return;
        send({
            destination: `/app/chat.send/${props.roomId}`,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ roomId: props.roomId, userId: props.prid, text }),
        });
        setText("");
    };

    return (
        <div className="chat-area">
            <h2>Chat</h2>
            <div className="messages">
                {messages.map((m, i) => (
                    <div key={i}><b>{m.author}({m.created_at})</b>: {m.text}</div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="sender">
                <input value={text} onChange={e => setText(e.target.value)} onKeyPress={event => {
                    if (event.key === 'Enter') {
                        sendMessage()
                    }
                }} placeholder="Write Message..."/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
export default TextChat;