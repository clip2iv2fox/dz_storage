import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getExercizesApi = async () => {
    try {
        const response = await api.get('/api/exercize');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deleteExercizeApi = async (idExercize) => {
    try {
        const response = await api.delete(`/api/exercize/${idExercize}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createExercizeApi = async (ExercizeData) => {
    try {
        const response = await api.post('/api/exercize', ExercizeData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};
