import {useEffect, useRef, useState} from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import './Room.css';
import TextChat from "./TextChat";
import HlsPlayerNew from "./Player/HLSPlayerNew";
import roomService from "./services/RoomService";
import Participants from "./Participants";
import LeaveButton from "./LeaveButton";

const RoomMain = (props) => {
    const [prid, setPrid] = useState(null)
    const pridRef = useRef(false)
    const API_URL = 'http://localhost:8080';
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const ws = useRef(null);
    const hasJoined = useRef(false); // Флаг, чтобы не join-ить много раз

    const handlerRef = useRef(null);
    //========================================================
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
    //========================================================

    useEffect(() => {
        roomService.getOrCreateParticipant(props.roomId).then(id => {
            setPrid(id);
            pridRef.current = id;
        })
        // Когда комната загружена и мы ещё не присоединились
        // if (room && !hasJoined.current) {
        //     joinRoom();
        //     hasJoined.current = true;
        }, [room]); // Зависимость от room

    //=============================================================
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
        //=============================================================
//=============================================================
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
        //=============================================================

    const leaveRoom = async () => {
        try {
            console.log('Leaving room:', roomId);
            const response = await fetch(`${API_URL}/api/rooms/${roomId}/leave`, {
                method: 'POST',
                credentials: 'include'
            });
//=============================================================
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
//=============================================================
    return (
        <div className="room-container">
            <LeaveButton/>


            <main className="main-area">
                <div className="video-area">
                    <HlsPlayerNew prid={prid} roomId={props.roomId}/>
                </div>
                <div className="chat-area">
                    <TextChat prid={prid} roomId={props.roomId}/>
                </div>
            </main>
            <Participants prid={prid} roomId={props.roomId}/>


        </div>
    )
        ;
}
export default RoomMain;