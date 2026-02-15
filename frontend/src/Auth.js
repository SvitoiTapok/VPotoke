import React, { useState } from 'react';

function Auth({ onLogin, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:8080';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!login || !password) {
            setMessage('Заполните все поля');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password })
            });

            const data = await response.json();

            if (data.success) {
                if (isLogin && onLogin) {
                    onLogin(data);
                } else {
                    setMessage('✅ Регистрация успешна! Теперь можете войти');
                    setIsLogin(true);
                    setLogin('');
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setMessage(`❌ Ошибка соединения: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{
                marginTop: 0,
                marginBottom: '20px',
                color: '#333',
                textAlign: 'center'
            }}>
                {isLogin ? 'Вход' : 'Регистрация'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        Логин:
                    </label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        disabled={loading}
                        placeholder="Введите логин"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        Пароль:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        placeholder="Введите пароль"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {!isLogin && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            Подтвердите пароль:
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Подтвердите пароль"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#ccc' : (isLogin ? '#2196F3' : '#4CAF50'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    {loading ? 'Обработка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                </button>
            </form>

            <button
                onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage('');
                    setLogin('');
                    setPassword('');
                    setConfirmPassword('');
                }}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#666',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }}
            >
                {isLogin ? "Нет аккаунта? Зарегистрироваться" : 'Уже есть аккаунт? Войти'}
            </button>

            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: message.startsWith('✅') ? '#e8f5e8' : '#fff3f3',
                    color: message.startsWith('✅') ? '#2e7d32' : '#c62828',
                    fontSize: '14px'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Auth;