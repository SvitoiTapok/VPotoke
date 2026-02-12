import {data} from "react-router-dom";

const API_BASE_URL = 'http://localhost:8080/room/api';
const roomService = {
    getSessionId: ()=> {
        let id = sessionStorage.getItem("session_id");
        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem("session_id", id);
        }
        return id;
    },
    getOrCreateParticipant: async (roomUUID) => {
        try {
            let isExist = sessionStorage.getItem(roomUUID)
            if(!isExist) {
                const response = await fetch(`${API_BASE_URL}/newParticipant?roomId=${roomUUID}&sessionId=${roomService.getSessionId()}`);
                let x = await response.json()
                sessionStorage.setItem(roomUUID, x)
                return x
            }
            return isExist
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    }

};

export default roomService;