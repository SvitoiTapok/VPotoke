import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsPlayer = ({ videoUrl }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!videoUrl) {
            console.error('No video URL provided');
            return;
        }

        // Формируем полный URL
        let fullUrl = videoUrl;
        if (!videoUrl.startsWith('http')) {
            // Если URL начинается с /api, добавляем localhost
            if (videoUrl.startsWith('/api')) {
                fullUrl = `http://localhost:8080${videoUrl}`;
            }
            // Если это просто путь типа "videos/..."
            else {
                fullUrl = `http://localhost:8080/api/video/stream/${videoUrl}`;
            }
        }

        console.log('Loading video from:', fullUrl);

        // Очищаем предыдущий источник
        video.removeAttribute('src');
        video.load();

        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 30,
                debug: true // Включаем отладку
            });

            hls.loadSource(fullUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest parsed, starting playback');
                video.play().catch(e => console.log('Autoplay failed:', e));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = fullUrl;
            video.addEventListener('loadedmetadata', () => {
                console.log('Video metadata loaded');
                video.play().catch(e => console.log('Autoplay failed:', e));
            });
        }
    }, [videoUrl]);

    return (
        <video
            ref={videoRef}
            controls
            style={{ width: "100%", height: "100%", background: "#000" }}
            onError={(e) => console.error('Video element error:', e)}
        />
    );
};

export default HlsPlayer;