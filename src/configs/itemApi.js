import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getItemsApi = async () => {
    try {
        const response = await api.get('/api/item');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createItemApi = async (id, itemData) => {
    try {
        const response = await api.post(`/api/item/${id}`, itemData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};