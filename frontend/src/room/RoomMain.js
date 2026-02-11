import {useState} from 'react';

import './Room.css';
import TextChat from "./TextChat";
import HlsPlayerNew from "./Player/HLSPlayerNew";

const RoomMain = () => {
    const [participants] = useState([
        'Алексей', 'Мария', 'Иван', 'Ольга'
    ]);

    return (
        <div className="room-container">


            <main className="main-area">
                <div className="video-area">
                    <HlsPlayerNew/>
                </div>
                <div className="chat-area">
                    <TextChat/>
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