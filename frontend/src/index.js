import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';
import RoomMain from "./room/RoomMain";
import {WebSocketProvider} from "./room/services/WebSocketContext";
import SorryMessage from "./room/SorryMessage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // {*вообще надо будет потом как-то id комнаты в путь конвертить, пока пофиг}
    <WebSocketProvider>
    <React.StrictMode>
        <BrowserRouter>
            <nav className="navigation">

            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/room/:roomId" element={<RoomMain/>}/>
                <Route path="/invite/:inviteLink" element={<RoomMain/>}/>
                <Route path="/sorryMessage" element={<SorryMessage/>}/>
            </Routes>
            </nav>
        </BrowserRouter>
    </React.StrictMode>
    </WebSocketProvider>
);

reportWebVitals();