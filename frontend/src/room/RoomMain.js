import {useEffect, useState} from 'react';

import './Room.css';
import TextChat from "./TextChat";
import HlsPlayerNew from "./Player/HLSPlayerNew";
import roomService from "./services/RoomService";

const RoomMain = (props) => {
    const [participants] = useState([
        'Алексей', 'Мария', 'Иван', 'Ольга'
    ]);
    const [prid, setPrid] = useState(null)
    const [mon, setMon] = useState(false)
    useEffect(() => {
        if(prid||mon) return
        setMon(true);
        roomService.getOrCreateParticipant(props.roomId).then((data) => setPrid(data))

        return () => {setMon(false)};
    }, [prid, mon])
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