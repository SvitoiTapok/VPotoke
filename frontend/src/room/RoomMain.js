import {useEffect, useRef, useState} from 'react';

import './Room.css';
import TextChat from "./TextChat";
import HlsPlayerNew from "./Player/HLSPlayerNew";
import roomService from "./services/RoomService";
import Participants from "./Participants";
import LeaveButton from "./LeaveButton";

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

            // handlerRef.current = () => {
            //     navigator.sendBeacon(
            //         `http://localhost:8080/room/api/leave/${id}/${props.roomId}`
            //     );
            // };
            //
            // //window.addEventListener("pagehide", handlerRef.current);
            // window.addEventListener("beforeunload", handlerRef.current);
        });

        // return () => {
        //     if (handlerRef.current) {
        //         //window.removeEventListener("pagehide", handlerRef.current);
        //         window.removeEventListener("beforeunload", handlerRef.current);
        //     }
        // };
    }, [props]);



    return (
        <div className="room-container">
            <LeaveButton/>


            <main className="main-area">
                <div className="video-area">
                    <HlsPlayerNew prid={prid} roomId={props.roomId}/>
                </div>
                <div className="chat-area">
                    <TextChat prid={prid} roomId={props.roomId}/>
                </div>
            </main>
            <Participants prid={prid} roomId={props.roomId}/>


        </div>
    )
        ;
}
export default RoomMain;