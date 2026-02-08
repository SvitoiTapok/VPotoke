import {useEffect, useRef, useState} from "react";
import Hls from "hls.js";

const HlsPlayer = () => {
    const videoRef = useRef(null);
    const markers = [
        { id: 1, time: 0, type: "event" },
        { id: 2, time: 47, type: "warning" },
        { id: 3, time: 93, type: "goal" }
    ];
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);


    useEffect(() => {
        const video = videoRef.current;
        const fileName = "output.m3u8"; // имя файла HLS плейлиста
        const PATH = `http://localhost:8080/api/video/stream/${fileName}`;
        const v = videoRef.current;

        const onTime = () =>
            setProgress((v.currentTime / v.duration) * 100);

        const onMeta = () => setDuration(v.duration);

        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);


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
        <div className="video-area">
            <video
                ref={videoRef}
                controls
                autoPlay
                className="video"
            />

            <div className="native-timeline-overlay">
                {markers.map(m => (
                    <div
                        key={m.id}
                        className="marker"
                        style={{left: `${(m.time / duration) * 100}%`}}
                        onClick={() => videoRef.current.currentTime = m.time}
                        title={`${m.time}s`}
                    />
                ))}
            </div>
        </div>
    );
}
export default HlsPlayer