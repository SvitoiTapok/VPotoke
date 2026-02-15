import React, { useState } from 'react';

function VideoUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
                setError('File too large. Maximum size is 5GB');
                return;
            }

            setFile(selectedFile);
            setError('');
            setSuccess('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccess('');
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const API_URL = 'http://localhost:8080';

            const response = await fetch(`${API_URL}/api/video/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setProgress(100);
                setSuccess(`✅ Video uploaded successfully!`);
                if (onUploadSuccess) {
                    onUploadSuccess(data);
                }
                setFile(null);
                document.getElementById('video-upload').value = '';
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(`❌ ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
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
                        border: '1px dashed #4CAF50',
                        borderRadius: '4px',
                        backgroundColor: '#fff'
                    }}
                />
            </div>

            {file && (
                <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                }}>
                    <p><strong>Selected file:</strong> {file.name}</p>
                    <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}

            {error && (
                <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#fff3f3',
                    border: '1px solid #ffcdd2',
                    borderRadius: '4px',
                    color: '#c62828'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #a5d6a7',
                    borderRadius: '4px',
                    color: '#2e7d32'
                }}>
                    {success}
                </div>
            )}

            {uploading && (
                <div style={{ marginBottom: '15px' }}>
                    <div style={{
                        height: '20px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            animation: 'progress 2s infinite'
                        }} />
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '5px' }}>
                        Processing video... This may take a few minutes
                    </p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: !file || uploading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: !file || uploading ? 'not-allowed' : 'pointer'
                }}
            >
                {uploading ? 'Processing...' : 'Upload Video'}
            </button>

            <style>{`
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
}

export default VideoUpload;