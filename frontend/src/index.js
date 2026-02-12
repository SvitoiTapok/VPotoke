import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';
import RoomMain from "./room/RoomMain";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // {*вообще надо будет потом как-то id комнаты в путь конвертить, пока пофиг}
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
                <Route path="/room" element={<RoomMain roomId="ebd009f1-ad4b-4709-a8e0-d9482edc0628"/>}/>
            </Routes>
            </nav>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
