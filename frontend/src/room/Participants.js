import {useEffect, useRef, useState} from "react";
import {useWS} from "./services/WebSocketContext";
import roomService from "./services/RoomService";

const Participants = (props) => {
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
                const others = chat.filter(p => p.id !== props.prid);
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
        roomService.togglePermission(userId, props.prid, type)
    };

    const makeAdmin = (userId) => {
        roomService.makeAdmin(userId, props.prid)
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

                        {selected === part.id && (
                            <div className="participant-menu">
                                <button onClick={() => togglePermission(part.id, "PLAYER")}>
                                    🎬 Управление плеером
                                </button>
                                <button onClick={() => togglePermission(part.id, "CHAT")}>
                                    💬 Право писать в чат
                                </button>
                                <button
                                    className="admin-btn"
                                    onClick={() => makeAdmin(part.id)}
                                >
                                    ⭐ Сделать админом
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

        </aside>
    );

}
export default Participants;