import {useEffect, useRef, useState} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const HlsPlayerNew = () => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [markers, serMarkers] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if (!videoRef.current || playerRef.current) return;
            const fileName = "output.m3u8";
            const PATH = `http://localhost:8080/player/api/stream/${fileName}`;

            const player = videojs(videoRef.current, {
                controls: true,
                autoplay: true,
                preload: "auto",
                fluid: true,
                sources: [{
                    src: PATH,
                    type: "application/x-mpegURL"
                }]
            });

            playerRef.current = player;
            serMarkers([
                { id: 1, time: 0, type: "event" },
                { id: 2, time: 47, type: "warning" },
                { id: 3, time: 93, type: "goal" }
            ]);

        }, 100)

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    const updateMarkers = () => {
        markers.forEach(m => {
            const el = document.createElement("div");
            el.className = "vjs-marker";
            console.log(playerRef.current.duration())
            el.style.left = `${(m.time / playerRef.current.duration()) * 100}%`;
            playerRef.current.controlBar.progressControl.el().appendChild(el);
        });
    }

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                className="video-js vjs-default-skin"
                onPause={updateMarkers}
            />
        </div>
    );
}
export default HlsPlayerNew