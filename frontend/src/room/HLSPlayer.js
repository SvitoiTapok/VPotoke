import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HlsPlayer = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const PATH = "http://localhost:8080/api/video/stream"

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
            style={{ width: "100%", height: "100%", background: "#000" }}
        />
    );
}
export default HlsPlayer