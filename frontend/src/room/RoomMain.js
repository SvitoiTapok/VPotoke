import {useEffect, useRef, useState} from 'react';

import './Room.css';
import TextChat from "./TextChat";
import HlsPlayerNew from "./Player/HLSPlayerNew";
import roomService from "./services/RoomService";

const RoomMain = (props) => {
    const [participants] = useState([
        'Алексей', 'Мария', 'Иван', 'Ольга'
    ]);
    const [prid, setPrid] = useState(null)
    const pridRef = useRef(false)

    const handlerRef = useRef(null);

    useEffect(() => {
        roomService.getOrCreateParticipant(props.roomId).then(id => {
            setPrid(id);
            pridRef.current = id;

            handlerRef.current = () => {
                navigator.sendBeacon(
                    `http://localhost:8080/room/api/leave/${id}`
                );
            };

            window.addEventListener("pagehide", handlerRef.current);
            window.addEventListener("beforeunload", handlerRef.current);
        });

        return () => {
            if (handlerRef.current) {
                window.removeEventListener("pagehide", handlerRef.current);
                window.removeEventListener("beforeunload", handlerRef.current);
            }
        };
    }, [props.roomId]);


    return (
        <div className="room-container">


            <main className="main-area">
                <div className="video-area">
                    <HlsPlayerNew prid={prid} roomId={props.roomId}/>
                </div>
                <div className="chat-area">
                    <TextChat prid={prid} roomId={props.roomId}/>
                </div>
            </main>
            <aside className="participants">
                <h2>Участники</h2>
                <ul>
                    {participants.map((p, i) => (
                        <li key={i}>{p}</li>
                    ))}
                </ul>
            </aside>


        </div>
    )
        ;
}


// const RoomMain = () => {
//     const PATH = "http://localhost:8080/api/video/stream"
//     return (
//         <video
//             width="720"
//             controls
//             preload="metadata"
//             src={PATH}
//         />
//     );
// }
export default RoomMain;