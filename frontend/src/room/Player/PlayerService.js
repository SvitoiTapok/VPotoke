const API_BASE_URL = 'http://localhost:8080/player/api';
const playerService = {

    sendPosition: async (page, size, sortBy, sortOrder, nameFilter, climateFilter, humanFilter) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getCities?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}&name=${nameFilter}&climate=${climateFilter}&human=${humanFilter}`);
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Ошибка соединения с сервером.');
            }
            throw error;
        }
    }
};

export default playerService;