import {data} from "react-router-dom";

const API_BASE_URL = 'http://localhost:8080/room/api';
const roomService = {
    getSessionId: ()=> {
        let id = sessionStorage.getItem("session_id");
        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem("session_id", id);
        }
        console.log(id)
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
    },
    sendPosition: async (author_id, room_id, timing) => {
        try {
            const response = await fetch(`${API_BASE_URL}/addNewPlayerPos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({authorId: author_id, roomId: room_id, timing: timing})
            });
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    getPositions: async (roomId, authorId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getPlayerPos?roomId=${roomId}&authorId=${authorId}`);
            return response.json()
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    getParticipants: async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getParticipants?roomID=${roomId}`);
            return response.json()
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    deleteParticipant: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteParticipant/${userId}`, {
                method: 'DELETE'
}
            )
            return response.json()
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    }

};

export default roomService;