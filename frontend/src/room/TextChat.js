import {useEffect, useRef, useState} from "react";
import {useWS} from "./services/WebSocketContext";

const TextChat = (props) => {
    const ws = useWS();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);


    useEffect(() => {
        if (!ws.current) return;
        let sub;
        console.log(props.roomId)
        ws.current.onConnect = () => {
            sub = ws.current.subscribe(`/topic/room/${props.roomId}/chat`, mes => {
                console.log(JSON.parse(mes.body))
                setMessages(prev => [...prev, JSON.parse(mes.body)]);
            });
        };

        return () => {sub?.unsubscribe()
            console.log("wtf")}
    }, [ws, props]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const send = () => {
        if (!ws.current || !ws.current.connected) return;

        ws.current.publish({
            destination: `/app/chat.send/${props.roomId}`,
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                roomId: props.roomId,
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
                    <div key={i}><b>{m.author}({m.created_at})</b>: {m.text}</div>
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