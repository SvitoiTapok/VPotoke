import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Room.css';
import HlsPlayer from "./HLSPlayer";

const RoomMain = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const ws = useRef(null);
    const hasJoined = useRef(false); // Флаг, чтобы не join-ить много раз

    const API_URL = 'http://localhost:8080';

    useEffect(() => {
        if (roomId) {
            fetchRoom();
        }

        // Cleanup function - вызывается только при размонтировании компонента
        return () => {
            console.log('Component unmounting, leaving room...');
            leaveRoom();
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomId]); // Зависимость только от roomId

    useEffect(() => {
        // Когда комната загружена и мы ещё не присоединились
        if (room && !hasJoined.current) {
            joinRoom();
            hasJoined.current = true;
        }
    }, [room]); // Зависимость от room

    const fetchRoom = async () => {
        try {
            console.log('Fetching room:', roomId);
            const response = await fetch(`${API_URL}/api/rooms/${roomId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Room data:', data);
                setRoom(data);

                setParticipants([
                    {
                        id: data.moderatorId,
                        name: data.moderatorLogin,
                        isModerator: true,
                        position: '0:00'
                    }
                ]);
            } else {
                setError('Room not found');
            }
        } catch (err) {
            console.error('Error loading room:', err);
            setError('Error loading room');
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async () => {
        try {
            console.log('Joining room:', roomId);
            const response = await fetch(`${API_URL}/api/rooms/${roomId}/join`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Successfully joined room');
                // Здесь можно обновить список участников
            }
        } catch (err) {
            console.error('Error joining room:', err);
        }
    };

    const leaveRoom = async () => {
        try {
            console.log('Leaving room:', roomId);
            const response = await fetch(`${API_URL}/api/rooms/${roomId}/leave`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                console.log('Successfully left room');
            }
        } catch (err) {
            console.error('Error leaving room:', err);
        }
    };

    const handleExitRoom = () => {
        leaveRoom().then(() => {
            navigate('/');
        });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Loading room...
            </div>
        );
    }

    if (error || !room) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#c62828',
                marginTop: '50px'
            }}>
                <h2>Error</h2>
                <p>{error || 'Room not found'}</p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#F97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="room-container">
            {/* Верхняя панель */}
            <div style={{
                padding: '10px 20px',
                backgroundColor: '#1E293B',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #F97316'
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#F97316' }}>{room.name}</h2>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#ccc' }}>
                        {room.description || 'No description'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ fontSize: '14px', textAlign: 'right' }}>
                        <div>Invite link:</div>
                        <code style={{
                            background: '#333',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            {window.location.origin}/invite/{room.inviteLink}
                        </code>
                    </div>
                    <button
                        onClick={handleExitRoom}
                        style={{
                            padding: '5px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Exit Room
                    </button>
                </div>
            </div>

            {/* Основная область */}
            <main style={{
                display: 'flex',
                height: 'calc(100vh - 120px)'
            }}>
                {/* Видео */}
                <div style={{
                    flex: 3,
                    backgroundColor: '#000',
                    position: 'relative'
                }}>
                    <HlsPlayer videoUrl={room.videoUrl} />
                </div>

                {/* Чат */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid #ddd'
                }}>
                    <div style={{
                        padding: '10px',
                        backgroundColor: '#1E293B',
                        color: 'white'
                    }}>
                        <h3 style={{ margin: 0 }}>Chat</h3>
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '10px',
                        overflowY: 'auto'
                    }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                padding: '5px 10px',
                                marginBottom: '5px',
                                backgroundColor: msg.sender === 'You' ? '#e3f2fd' : 'white',
                                borderRadius: '4px'
                            }}>
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (messageInput.trim()) {
                            setMessages([...messages, {
                                id: Date.now(),
                                text: messageInput,
                                sender: 'You'
                            }]);
                            setMessageInput('');
                        }
                    }} style={{
                        padding: '10px',
                        borderTop: '1px solid #ddd',
                        display: 'flex',
                        gap: '5px'
                    }}>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </main>

            {/* Участники */}
            <div style={{
                position: 'fixed',
                right: '20px',
                top: '120px',
                width: '200px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ margin: '0 0 10px', color: '#1E293B' }}>
                    Participants ({participants.length})
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {participants.map(p => (
                        <li key={p.id} style={{
                            padding: '5px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            {p.isModerator && '👑'}
                            <span>{p.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RoomMain;