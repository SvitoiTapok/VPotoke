import { createContext, useContext, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);
    const subsRef = useRef(new Map()); // key = destination, value = callback

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            console.log("WS connected");
            subsRef.current.forEach((cb, dest) => {
                client.subscribe(dest, cb);
            });
        };

        client.activate();
        clientRef.current = client;

        return () => client.deactivate();
    }, []);

    const subscribe = (destination, callback) => {
        subsRef.current.set(destination, callback);

        const client = clientRef.current;
        let sub = null;

        if (client?.connected) {
            sub = client.subscribe(destination, callback);
        }

        return {
            unsubscribe() {
                subsRef.current.delete(destination);
                sub?.unsubscribe();
            }
        };
    };

    const send = ({ destination, body, headers = {} }) => {
        const client = clientRef.current;
        if (!client?.connected) return;
        client.publish({ destination, body, headers });
    };

    return (
        <WebSocketContext.Provider value={{ subscribe, send }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWS = () => useContext(WebSocketContext);
