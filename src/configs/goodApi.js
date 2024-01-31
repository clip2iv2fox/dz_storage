import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const deleteGoodApi = async (id) => {
    try {
        const response = await api.delete(`/api/good/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createGoodApi = async (id, goodData) => {
    try {
        const response = await api.post(`/api/good/${id}`, goodData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const updateGoodApi = async (id, goodData) => {
    try {
        const response = await api.put(`/api/good/${id}`, goodData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};