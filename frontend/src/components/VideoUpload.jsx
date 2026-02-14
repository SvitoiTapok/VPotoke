import React, { useState } from 'react';

function VideoUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Проверка размера (5GB)
            if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
                setError('File too large. Maximum size is 5GB');
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Важно: используем полный URL бэкенда
            const API_URL = 'http://localhost:8080'; // или 'http://backend:8080' если из контейнера

            console.log('Uploading to:', `${API_URL}/api/video/upload`);

            const response = await fetch(`${API_URL}/api/video/upload`, {
                method: 'POST',
                body: formData,
                // НЕ добавляем Content-Type - браузер сам установит с boundary
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                setProgress(100);
                if (onUploadSuccess) {
                    onUploadSuccess(data);
                }
                alert('Video uploaded successfully!');
                setFile(null);
                document.getElementById('video-upload').value = '';
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(`Network error: ${err.message}. Make sure backend is running on port 8080`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#1E293B',
            borderRadius: '8px',
            color: 'white'
        }}>
            <h2 style={{ marginBottom: '20px', color: '#F97316' }}>
                VPotoke Upload Test
            </h2>

            <div style={{ marginBottom: '15px' }}>
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#2D3A4B',
                        color: 'white',
                        border: '1px solid #F97316',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {file && (
                <div style={{ marginBottom: '15px' }}>
                    <p><strong>File:</strong> {file.name}</p>
                    <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}

            {error && (
                <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    border: '1px solid #DC2626',
                    borderRadius: '4px',
                    color: '#FCA5A5'
                }}>
                    ❌ {error}
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: !file || uploading ? '#4B5563' : '#F97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: !file || uploading ? 'not-allowed' : 'pointer'
                }}
            >
                {uploading ? 'Processing...' : 'Upload'}
            </button>
        </div>
    );
}

export default VideoUpload;