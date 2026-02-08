import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsPlayer = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const fileName = "output.m3u8"; // имя файла HLS плейлиста
        const PATH = `http://localhost:8080/api/video/stream/${fileName}`;

        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 30,
            });

            hls.loadSource(PATH);
            hls.attachMedia(video);

            return () => hls.destroy();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = PATH;
        }
    }, []);

    return (
        <video
            ref={videoRef}
            controls
            autoPlay

        />
    );
}
export default HlsPlayer