import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/video/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Success!');
        console.log('Success:', data);
      } else {
        setMessage('❌ Error: ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Network error');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
      <div style={{ padding: '20px' }}>
        <h1>VPotoke Upload Test</h1>

        <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
        />

        <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{ marginLeft: '10px' }}
        >
          Upload
        </button>

        {message && <p>{message}</p>}
      </div>
  );
}

export default App;