import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth';
import CreateRoom from './CreateRoom';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const navigate = useNavigate();

  // Проверяем сессию при загрузке
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('Checking session...');
      const response = await fetch('http://localhost:8080/api/auth/me', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Session check response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Session data:', data);
        setUser(data);
      } else {
        console.log('Not authenticated');
        setUser(null);
      }
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
    console.log('User logged in:', userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  };

  const handleRoomCreated = (room) => {
    setShowCreateRoom(false);
    // Переходим в созданную комнату
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
