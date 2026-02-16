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
                // const response = await fetch(`${API_BASE_URL}/newParticipant?roomId=${roomUUID}&sessionId=${crypto.randomUUID()}`);
                // let x = await response.json()
                // return x
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    createParticipant: async (roomUUID) => {
        try {
            const response = await fetch(`${API_BASE_URL}/newParticipant?roomId=${roomUUID}&sessionId=${roomService.getSessionId()}`);
            let x = await response.json()
            sessionStorage.setItem(roomUUID, x)
            return x
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    getOrCreateUser: async (roomUUID, name) => {
        try {
            let isExist = sessionStorage.getItem(roomUUID)
            if(!isExist) {
                const response = await fetch(`${API_BASE_URL}/newParticipantWithName?roomId=${roomUUID}&sessionId=${roomService.getSessionId()}&name=${name}`);
                let x = await response.json()
                sessionStorage.setItem(roomUUID, x)
                return x
            }
            return isExist
            // const response = await fetch(`${API_BASE_URL}/newParticipant?roomId=${roomUUID}&sessionId=${crypto.randomUUID()}`);
            // let x = await response.json()
            // return x
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },
    updateName: async (authorId, name) => {
        const response = await fetch(`${API_BASE_URL}/updateName?authorId=${authorId}&name=${name}`);
    },

    getVideoName: async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getVideoName?roomId=${roomId}`);
            return await response.text();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    },

    sendSyncOnRequest: async (roomId, userId, pos) => {
        return await fetch(`${API_BASE_URL}/OnSyncMode?roomId=${roomId}&userId=${userId}&pos=${pos}`)
    },
    sendSyncOffRequest: async (roomId, userId) => {
        return await fetch(`${API_BASE_URL}/OffSyncMode?roomId=${roomId}&userId=${userId}`)
    },
    togglePermission: async (userId,adminId, type, roomId) => {
        console.log("toggle")
        return await fetch(`${API_BASE_URL}/togglePermission?userId=${userId}&adminId=${adminId}&type=${type}&roomId=${roomId}`)
    },
    makeAdmin: async (userId, adminId, roomId) => {
        return await fetch(`${API_BASE_URL}/makeAdmin?userId=${userId}&adminId=${adminId}&roomId=${roomId}`)
    },
    deleteParticipant: async (userId, roomId, adminId) =>{
        return await fetch(`${API_BASE_URL}/deleteParticipant/${userId}/${roomId}/${adminId}`, {
                method: 'DELETE'
            }
        )
    },
    destroyRoom: async (roomId, adminId) =>{
        return await fetch(`${API_BASE_URL}/destroyRoom/${roomId}/${adminId}`, {
                method: 'DELETE'
            }
        )
    },

};

export default roomService;