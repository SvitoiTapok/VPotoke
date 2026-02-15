import React, { useState } from 'react';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true); // true = login, false = register
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:8080';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Базовая валидация
        if (!login || !password) {
            setMessage('Please fill in all fields');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setMessage('Passwords do not match');
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
                setMessage(`✅ ${data.message}`);
                // Очищаем форму
                setLogin('');
                setPassword('');
                setConfirmPassword('');

                // Если это успешный логин, вызываем onLogin
                if (isLogin && onLogin) {
                    onLogin(data);
                }
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setMessage(`❌ Network error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '400px',
            margin: '20px auto',
            border: '1px solid #ccc',
            borderRadius: '4px'
        }}>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Login:
                    </label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {!isLogin && (
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '8px',
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
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
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
                    border: '1px solid #4CAF50',
                    borderRadius: '4px',
                    color: '#4CAF50',
                    cursor: 'pointer'
                }}
            >
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>

            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Auth;