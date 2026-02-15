import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';
import RoomMain from "./room/RoomMain";
import {WebSocketProvider} from "./room/services/WebSocketContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // {*вообще надо будет потом как-то id комнаты в путь конвертить, пока пофиг}
    <WebSocketProvider>
    <React.StrictMode>
        <BrowserRouter>
            <nav className="navigation">
                <NavLink
                    to="/room"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Main
                </NavLink>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/room/:roomId" element={<RoomMain/>}/>
                <Route path="/invite/:inviteLink" element={<RoomMain/>}/>
                {/*<Route path="/room" element={<RoomMain roomId="ebd009f1-ad4b-4709-a8e0-d9482edc0628"/>}/>*/}
            </Routes>
            </nav>
        </BrowserRouter>
    </React.StrictMode>
    </WebSocketProvider>
);

reportWebVitals();