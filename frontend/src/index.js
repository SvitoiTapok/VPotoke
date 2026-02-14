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
            {/* Навигация теперь будет видна на всех страницах */}
            <nav className="navigation" style={{
                padding: '10px 20px',
                backgroundColor: '#1E293B',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
            }}>
                <NavLink
                    to="/"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                    style={({isActive}) => ({
                        color: isActive ? '#F97316' : 'white',
                        textDecoration: 'none',
                        padding: '5px 10px'
                    })}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/room"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                    style={({isActive}) => ({
                        color: isActive ? '#F97316' : 'white',
                        textDecoration: 'none',
                        padding: '5px 10px'
                    })}
                >
                    Room
                </NavLink>
            </nav>

            {/* Контейнер для страниц */}
            <div style={{padding: '20px'}}>
                <Routes>
                    <Route path="/" element={<App />}/>
                    <Route path="/room" element={<RoomMain/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();