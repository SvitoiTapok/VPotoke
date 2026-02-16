import {useNavigate} from "react-router-dom";
import roomService from "./services/RoomService";
import {useEffect} from "react";
import {useWS} from "./services/WebSocketContext";

const LeaveButton = (props) => {
    const navigate = useNavigate();
    const {subscribe, send} = useWS()
    useEffect(() => {
        const sub1 = subscribe(`/topic/room/${props.roomId}/exit`, (msg) => {
            navigate("/");
        });
        const sub2 = subscribe(`/topic/room/${props.roomId}/exit/${props.prid}`, (msg) => {
            navigate("/");
        });
        return () => {
            sub1?.unsubscribe();
            sub2?.unsubscribe();
        };
    }, [subscribe, props.prid, props.roomId]);

    const handleLeave = () => {
        roomService.deleteParticipant(props.prid, props.roomId, props.prid)
    };
    const handleDestroy = () => {
        roomService.destroyRoom(props.roomId, props.prid)
    }

    return (
        <div>
            <button className="leave-button" onClick={handleLeave}>
                Leave
            </button>
            {props.admin && (
                <button className="destroy-button" onClick={handleDestroy}>
                    Destroy Room
                </button>
            )}
        </div>
    );
};

export default LeaveButton;