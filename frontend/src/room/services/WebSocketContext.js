import { createContext, useContext, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 3000,
            onConnect: () => console.log("WS connected"),
        });
        client.activate();
        clientRef.current = client;
        return () => client.deactivate();
    }, []);

    return (
        <WebSocketContext.Provider value={clientRef}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWS = () => useContext(WebSocketContext);
