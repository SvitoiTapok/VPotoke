import React, { useState, useEffect } from 'react';
import VideoUpload from './components/VideoUpload';

function CreateRoom({ user, onRoomCreated, onCancel }) {
    const [step, setStep] = useState(1); // 1: выбор видео, 2: настройки комнаты
    const [userVideos, setUserVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [newVideoFile, setNewVideoFile] = useState(null);
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadedVideoId, setUploadedVideoId] = useState(null);

    const API_URL = 'http://localhost:8080/room/api';

    // Загружаем список видео пользователя при монтировании
    useEffect(() => {
        if (user) {
            fetchUserVideos();
        }
    }, [user]);

    const fetchUserVideos = async () => {
        try {
            const response = await fetch(`${API_URL}/my-videos`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserVideos(data);
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
        }
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    const handleUploadSuccess = (data) => {
        setUploadedVideoId(data.videoId);
        setSelectedVideo({ id: data.videoId, fileName: data.message.split(':')[1]?.trim() || 'New video' });
        setStep(2);
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            setError('Please enter room name');
            return;
        }

        if (!selectedVideo && !uploadedVideoId) {
            setError('Please select a video');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Creating room with data:', {
                name: roomName,
                description: roomDescription,
                videoId: selectedVideo?.id || uploadedVideoId
            });

            const response = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: roomName,
                    description: roomDescription,
                    videoId: selectedVideo?.id || uploadedVideoId
                })
            });

            console.log('Create room response status:', response.status);

            const data = await response.json();
            console.log('Create room response data:', data);

            if (response.ok) {
                onRoomCreated(data);
            } else {
                setError(data.error || 'Failed to create room');
            }
        } catch (err) {
            console.error('Error creating room:', err);
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ marginTop: 0, color: '#F97316' }}>
                {step === 1 ? 'Step 1: Choose Video' : 'Step 2: Room Settings'}
            </h2>

            {step === 1 ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Your Videos</h3>
                        {userVideos.length === 0 ? (
                            <p style={{ color: '#666' }}>No videos yet. Upload a new one!</p>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '10px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}>
                                {userVideos.map(video => (
                                    <div
                                        key={video.id}
                                        onClick={() => handleVideoSelect(video)}
                                        style={{
                                            padding: '10px',
                                            border: selectedVideo?.id === video.id ? '2px solid #F97316' : '1px solid #ddd',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedVideo?.id === video.id ? '#fff5e6' : 'white'
                                        }}
                                    >
                                        <div><strong>{video.fileName}</strong></div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Size: {(video.fileSize / (1024 * 1024)).toFixed(2)} MB |
                                            Expires: {new Date(video.expiresAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3>Or Upload New Video</h3>
                        <VideoUpload onUploadSuccess={handleUploadSuccess} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!selectedVideo && !uploadedVideoId}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: (!selectedVideo && !uploadedVideoId) ? '#ccc' : '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: (!selectedVideo && !uploadedVideoId) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Room Name *
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="e.g., Movie Night with Friends"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Description (optional)
                        </label>
                        <textarea
                            value={roomDescription}
                            onChange={(e) => setRoomDescription(e.target.value)}
                            placeholder="Describe what you're watching..."
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        <strong>Selected Video:</strong> {selectedVideo?.fileName || 'Newly uploaded video'}
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px',
                            backgroundColor: '#fff3f3',
                            border: '1px solid #ffcdd2',
                            borderRadius: '4px',
                            color: '#c62828',
                            marginBottom: '20px'
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setStep(1)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCreateRoom}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: loading ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CreateRoom;