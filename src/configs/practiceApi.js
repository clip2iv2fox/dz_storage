import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const createPracticeApi = async (id, PracticeData) => {
    try {
        await api.post(`/api/practice/${id}`, PracticeData);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const updatePracticeApi = async (id, PracticeData) => {
    try {
        await api.put(`/api/practice/${id}`, PracticeData);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deletePracticeApi = async (id) => {
    try {
        await api.delete(`/api/practice/${id}`);
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};