import React, { useState } from 'react';
import Auth from './Auth';
import VideoUpload from './components/VideoUpload.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
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
              fontSize: '28px'
            }}>
              VPotoke
            </h1>

            {/* Навигация */}
            <nav style={{ display: 'flex', gap: '15px' }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#1E293B',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Главная
              </button>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#1E293B',
                cursor: 'pointer'
              }}>
                FAQ
              </button>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#1E293B',
                cursor: 'pointer'
              }}>
                Контакты
              </button>
            </nav>
          </div>

          {/* Кнопки авторизации */}
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

        {/* Основной контент */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          {/* Левая колонка - основной контент */}
          <div>
            {/* Блок с видео */}
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

            {/* Кнопка создания комнаты */}
            <div style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: user ? '#f8fff8' : '#f5f5f5'
            }}>
              <h3 style={{ marginTop: 0, color: '#1E293B' }}>
                Создать комнату для просмотра
              </h3>
              {user ? (
                  <>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      Загрузите видео и пригласите друзей
                    </p>
                    <VideoUpload onUploadSuccess={handleUploadSuccess} />
                  </>
              ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      🔒 Требуется авторизация для создания комнаты
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#F97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                    >
                      Войти или зарегистрироваться
                    </button>
                  </div>
              )}
            </div>
          </div>

          {/* Правая колонка - FAQ и информация */}
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

            {/* Дополнительная информация */}
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