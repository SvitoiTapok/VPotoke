import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
import RoomMain from "./room/RoomMain";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/room/:roomId" element={<RoomMain/>}/>
                <Route path="/invite/:inviteLink" element={<RoomMain/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();