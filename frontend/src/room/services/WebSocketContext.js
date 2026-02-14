import { createContext, useContext, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);
    const pendingSubs = useRef([]); // отложенные подписки до подключения
    if (!clientRef.current) {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 3000,

        });
        client.onConnect = () => {
            pendingSubs.current.forEach(({ destination, callback }) => {
                client.subscribe(destination, callback);
            });
            pendingSubs.current = [];
            console.log("WS connected");
        }

        client.activate();
        clientRef.current = client;
    }
    const subscribe = (destination, callback) => {
        const client = clientRef.current;
        if (!client) return null;

        if (client.connected) {
            return client.subscribe(destination, callback);
        } else {
            pendingSubs.current.push({ destination, callback });
            return null;
        }
    };
    const send = ({ destination, body, headers = {} }) => {
        const client = clientRef.current;
        if (!client || !client.connected) {
            console.log("WS not connected yet");
            return;
        }
        client.publish({ destination, body, headers });
    };

    return (
        <WebSocketContext.Provider value={{ subscribe, send, client: clientRef.current }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Хук для использования WS в компонентах
export const useWS = () => useContext(WebSocketContext);
