import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getPlanesApi = async () => {
    try {
        const response = await api.get('/api/plane');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deletePlaneApi = async (idPlane) => {
    try {
        const response = await api.delete(`/api/plane/${idPlane}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createPlaneApi = async (planeData) => {
    try {
        const response = await api.post('/api/plane', planeData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};
