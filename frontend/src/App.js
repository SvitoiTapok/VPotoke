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
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Шапка с навигацией */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '10px 0',
          borderBottom: '2px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{
              color: '#F97316',
              margin: 0,
              fontSize: '28px',
              cursor: 'pointer'
            }} onClick={() => navigate('/')}>
              VPotoke
            </h1>

            <nav style={{ display: 'flex', gap: '15px' }}>
              <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#1E293B',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
              >
                Главная
              </button>
              <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#1E293B',
                    cursor: 'pointer'
                  }}
              >
                FAQ
              </button>
            </nav>
          </div>

          <div>
            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#1E293B' }}>
                <strong>{user.login}</strong>
              </span>
                  <button
                      onClick={handleLogout}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                  >
                    Выйти
                  </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAuth(true)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#F97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                >
                  Войти / Регистрация
                </button>
            )}
          </div>
        </div>

        {/* Модальное окно авторизации */}
        {showAuth && !user && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                position: 'relative',
                maxWidth: '400px',
                width: '90%'
              }}>
                <button
                    onClick={() => setShowAuth(false)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                >
                  ✕
                </button>
                <Auth onLogin={handleLogin} />
              </div>
            </div>
        )}

        {/* Модальное окно создания комнаты */}
        {showCreateRoom && user && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              overflow: 'auto'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '700px',
                width: '95%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <CreateRoom
                    user={user}
                    onRoomCreated={handleRoomCreated}
                    onCancel={() => setShowCreateRoom(false)}
                />
              </div>
            </div>
        )}

        {/* Основной контент */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          <div>
            <div style={{
              backgroundColor: '#1E293B',
              color: 'white',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#F97316', marginTop: 0 }}>
                Создайте виртуальный кинозал
              </h2>
              <p>
                Смотрите видео вместе с друзьями и семьёй, где бы они ни находились.
                Синхронное воспроизведение, чат и многое другое!
              </p>
            </div>

            <div style={{
              padding: '30px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: user ? '#f8fff8' : '#f5f5f5',
              textAlign: 'center'
            }}>
              {user ? (
                  <>
                    <h3 style={{ marginTop: 0, color: '#1E293B' }}>
                      Начните просмотр прямо сейчас!
                    </h3>
                    <p style={{ color: '#666', marginBottom: '25px' }}>
                      Загрузите видео и пригласите друзей
                    </p>
                    <button
                        onClick={() => setShowCreateRoom(true)}
                        style={{
                          padding: '15px 40px',
                          backgroundColor: '#F97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                    >
                      Создать комнату
                    </button>
                  </>
              ) : (
                  <>
                    <h3 style={{ marginTop: 0, color: '#1E293B' }}>
                      Хотите создать свою комнату?
                    </h3>
                    <p style={{ color: '#666', marginBottom: '25px' }}>
                      🔒 Требуется авторизация для создания комнаты
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        style={{
                          padding: '12px 30px',
                          backgroundColor: '#F97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                    >
                      Войти или зарегистрироваться
                    </button>
                  </>
              )}
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#1E293B', marginTop: 0 }}>
                Часто задаваемые вопросы
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#F97316', marginBottom: '5px' }}>
                  Как это работает?
                </h4>
                <p style={{ color: '#666', margin: 0 }}>
                  Зарегистрируйтесь, загрузите видео и создайте комнату.
                  Поделитесь ссылкой с друзьями и смотрите вместе!
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#F97316', marginBottom: '5px' }}>
                  Какие видео можно загружать?
                </h4>
                <p style={{ color: '#666', margin: 0 }}>
                  Любые видео до 5GB. Видео хранятся 6 часов и автоматически удаляются.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#F97316', marginBottom: '5px' }}>
                  Сколько может быть участников?
                </h4>
                <p style={{ color: '#666', margin: 0 }}>
                  До 10 человек в одной комнате для стабильной синхронизации.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#F97316', marginBottom: '5px' }}>
                  Нужна регистрация?
                </h4>
                <p style={{ color: '#666', margin: 0 }}>
                  Да, для создания комнаты нужна регистрация.
                  Участники могут присоединяться без регистрации по ссылке.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e8f0fe',
              borderRadius: '8px',
              borderLeft: '4px solid #F97316'
            }}>
              <p style={{ margin: 0, color: '#1E293B' }}>
                <strong>ℹ️ Важно:</strong> Соблюдайте авторские права.
                Загружайте только те видео, которые вы имеете право распространять.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;