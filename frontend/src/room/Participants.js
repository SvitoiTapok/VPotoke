import {useEffect, useRef, useState} from "react";
import {useWS} from "./services/WebSocketContext";
import roomService from "./services/RoomService";
import LeaveButton from "./LeaveButton";
import {useNavigate} from "react-router-dom";

const Participants = (props) => {
    const navigate = useNavigate()
    const {subscribe, send} = useWS();
    const [participants, setParticipants] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState("")
    const [editing, setEditing] = useState(false);
    const [selected, setSelected] = useState(null); // id участника с открытым меню


    useEffect(() => {
        const sub = subscribe(`/topic/room/${props.roomId}/participants`, (msg) => {
            if (props.prid) {
                const chat = JSON.parse(msg.body);
                const avatar = chat.find(p => p.id === props.prid);
                console.log(avatar)
                const others = chat.filter(p => p.id !== props.prid);
                console.log(avatar)
                if(avatar===undefined) roomService.createParticipant(props.roomId)
                setAvatar(avatar);
                setParticipants(others);
            }
        });
        let inter = setTimeout(() => {
            send({
                destination: `/app/part.upd/${props.roomId}`
            })
        }, 300)

        return () => {
            sub?.unsubscribe();
            clearTimeout(inter)
        };
    }, [subscribe, props.prid, props.roomId]);

    const handleSaveName = () => {
        if (!name.trim()) return;

        roomService.updateName(props.prid, name).then(r => {
            setAvatar({...avatar, name: name});
            setEditing(false);
        })

    };
    const togglePermission = (userId, type) => {
        roomService.togglePermission(userId, props.prid, type, props.roomId)
    };

    const makeAdmin = (userId) => {
        roomService.makeAdmin(userId, props.prid, props.roomId)
    };
    const deleteParticipant = (userId) => {
        roomService.deleteParticipant(userId, props.roomId, props.prid)
    };

    return (
        <aside className="participants">
            <h2>Вы</h2>
            {avatar && (
                <li key={avatar.id} className="participant" onClick={() => setEditing(true)}>
                    <span className="avatar" style={{backgroundColor: avatar.color}}/>
                    {editing ? (
                        <div className="edit-name">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                                placeholder="Введите имя"
                            />
                            <button onClick={handleSaveName}>Сохранить</button>
                        </div>
                    ) : (
                        <span className="name">{avatar.name}</span>
                    )}
                </li>
            )}

            <h2>Остальные участники</h2>
            <ul className="participants-list">
                {participants.map((part) => (
                    <li
                        key={part.id}
                        className="participant"
                        onClick={() =>
                            setSelected(selected === part.id ? null : part.id)
                        }
                    >
                        <span className="avatar" style={{backgroundColor: part.color}}/>
                        <span className="name">{part.name}</span>

                        {selected === part.id && avatar.adminRights && !part.adminRights && (
                            <div className="participant-menu">
                                <button onClick={() => togglePermission(part.id, "PLAYER")}>
                                    Управление плеером
                                </button>
                                <button onClick={() => togglePermission(part.id, "CHAT")}>
                                    Право писать в чат
                                </button>
                                <button onClick={() => deleteParticipant(part.id)}>
                                    Выгнать из комнаты
                                </button>
                                <button
                                    className="admin-btn"
                                    onClick={() => makeAdmin(part.id)}
                                >
                                    Сделать админом
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <LeaveButton admin={avatar?.adminRights} roomId={props.roomId} prid={props.prid}/>

        </aside>

    );

}
export default Participants;