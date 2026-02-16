import {useEffect, useRef, useState} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import roomService from "../services/RoomService";
import {useWS} from "../services/WebSocketContext";
import {data} from "react-router-dom";

const HlsPlayerNew = (props) => {
    const {subscribe, send} = useWS()
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [active, setActive] = useState(false);
    const [isHaveRights, setIsHaveRights] = useState(false);
    const isRemote = useRef(false);

    // useEffect(() => {
    //         roomService.getVideoName(props.roomId).then((data) => {
    //             setFilename(data);
    //             console.log(data)
    //         })
    // }, []);
    useEffect(() => {

        console.log(videoRef.current)
        console.log(playerRef.current)
        if (!videoRef.current || playerRef.current) return;


        setTimeout(()=>{const PATH = `http://localhost:8080/player/api/stream/${props.roomId}/master.m3u8`;

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

        player.on("ready", () => {
            console.log("PLAYER READY");
        });

        player.on("play", () => {
            console.log(isRemote.current)
            if (isRemote.current) return;
            send({ destination: `/app/player.play/${props.roomId}` });
        });

        player.on("pause", () => {
            console.log(isRemote.current)
            if (isRemote.current) return;
            send({ destination: `/app/player.pause/${props.roomId}` });
        });

        player.on("seeked", () => {
            if (isRemote.current) {
                isRemote.current = false;
                return;
            }
            const timing = playerRef.current.currentTime();
            send({
                destination: `/app/player.pos/${props.roomId}`,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(timing),
            });
            console.log("hhh")
        });},100)

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
        setMarkers(chat);
    });
    let inter = setInterval(() => {
        if (!playerRef.current) return;
        let timing = Math.floor(playerRef.current.currentTime())
        send({
            destination: `/app/player.send/${props.roomId}`,
            headers: {"content-type": "application/json"},
            body: JSON.stringify({authorId: props.prid, roomId: props.roomId, timing: timing}),
        })
    }, 1000)

    return () => {
        sub?.unsubscribe();
        clearInterval(inter)
    };
}, [props]);

useEffect(() => {
    console.log("rooom" + props.roomId)
    const sub1 = subscribe(`/topic/room/${props.roomId}/pause`, (msg) => {
        if (!playerRef.current) return;
        playerRef.current.pause()
    });
    const sub2 = subscribe(`/topic/room/${props.roomId}/play`, (msg) => {
        if (!playerRef.current) return;
        playerRef.current.play()
    });
    const sub3 = subscribe(`/topic/room/${props.roomId}/position`, (msg) => {
        if (!playerRef.current) return;
        isRemote.current = true;
        playerRef.current.currentTime(JSON.parse(msg.body) + 5)
    });
    const sub4 = subscribe(`/topic/room/${props.roomId}/sync`, (msg) => {
        setActive(JSON.parse(msg.body))
    });
    const sub5 = subscribe(`/topic/room/${props.roomId}/participants`, (msg) => {
        const chat = JSON.parse(msg.body);
        if (props.prid) {
            const avatar = chat.find(p => p.id === props.prid);
            setIsHaveRights(avatar.playerRights)
        }
    });

    return () => {
        sub1?.unsubscribe();
        sub2?.unsubscribe();
        sub3?.unsubscribe();
        sub4?.unsubscribe();
        sub5?.unsubscribe();
    };
}, [subscribe, props.prid, props.roomId]);
useEffect(() => {
    if (playerRef.current) updateMarkers()
}, [markers]);
const updateMarkers = () => {

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

const toggle = () => {
    const next = !active;
    setActive(next);
    if (!playerRef.current) return;
    if (next) {
        roomService.sendSyncOnRequest(props.roomId, props.prid, playerRef.current.currentTime())
    } else {
        roomService.sendSyncOffRequest(props.roomId, props.prid)
    }
};
return (
    <div data-vjs-player>
        <video
            ref={videoRef}
            className="video-js vjs-default-skin"
        />
        {isHaveRights && (
            <div>
                <span>Синхронный режим:</span>
                <button
                    className={`toggle-btn ${active ? "on" : "off"}`}
                    onClick={toggle}
                >
                    {active ? "ON" : "OFF"}
                </button>
            </div>)
        }

    </div>
)
    ;
}
export default HlsPlayerNew