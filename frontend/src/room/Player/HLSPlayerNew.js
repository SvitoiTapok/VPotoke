import {useEffect, useRef, useState} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import roomService from "../services/RoomService";
import {useWS} from "../services/WebSocketContext";

const HlsPlayerNew = (props) => {
    const {subscribe, send} = useWS()
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [markers, setMarkers] = useState([]);

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
            // setMarkers([
            //     { id: 1, time: 0, type: "event" },
            //     { id: 2, time: 47, type: "warning" },
            //     { id: 3, time: 93, type: "goal" }
            // ]);

        }, 100)


        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);
    // useEffect(() => {
    //     const t = setInterval(()=>{
    //         let timing = Math.floor(playerRef.current.currentTime())
    //         roomService.sendPosition(props.prid, props.roomId, timing)
    //         roomService.getPositions(props.roomId, props.prid).then((data)=>{
    //             setMarkers(data)
    //             updateMarkers()
    //         })
    //     }, 1000)
    //     return () => clearInterval(t)
    // }, [props, markers]);

    useEffect(() => {
        const sub = subscribe(`/topic/room/${props.roomId}/player`, (msg) => {
            const chat = JSON.parse(msg.body);
            console.log(chat)
            setMarkers(chat);
            updateMarkers()
        });
        let inter = setInterval(()=>{
            let timing = Math.floor(playerRef.current.currentTime())
            console.log("nice")
            send({
                destination: `/app/player.send/${props.roomId}`,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ authorId: props.prid, roomId: props.roomId, timing: timing }),
            })
        }, 1000)

        return () => {sub?.unsubscribe(); clearInterval(inter)};
    }, [subscribe, props, markers]);
    const updateMarkers = () => {
        console.log(markers)
        const progressEl = playerRef.current.controlBar.progressControl.el();

        progressEl.querySelectorAll(".vjs-marker").forEach(el => el.remove());
        playerRef.current.controlBar.progressControl.el()
        markers.forEach(m => {
            const el = document.createElement("div");
            el.className = "vjs-marker";
            el.style.background = m.color
            el.style.left = `${(m.timing / playerRef.current.duration()) * 100}%`;
            // const label = document.createElement("span");
            // label.className = "vjs-marker-label";
            // label.textContent = m.name || "";
            // el.appendChild(label)
            playerRef.current.controlBar.progressControl.seekBar.el().appendChild(el);
        });
    }

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                className="video-js vjs-default-skin"
            />
        </div>
    );
}
export default HlsPlayerNew