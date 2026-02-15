import React, { useState } from 'react';
import Auth from './Auth';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
      <div style={{ padding: '20px' }}>
        <h1>VPotoke</h1>

        {user ? (
            <div>
              <div style={{
                padding: '10px',
                backgroundColor: '#e8f5e8',
                border: '1px solid #4CAF50',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p><strong>Logged in as:</strong> {user.login}</p>
                <p><strong>User ID:</strong> {user.userId}</p>
                <button
                    onClick={handleLogout}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                >
                  Logout
                </button>
              </div>

              {/* Здесь будет остальной функционал приложения */}
              <p>Welcome! You can now access protected features.</p>

            </div>
        ) : (
            <Auth onLogin={handleLogin} />
        )}
      </div>
  );
}

export default App;