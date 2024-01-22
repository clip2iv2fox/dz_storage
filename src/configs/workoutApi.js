import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getWorkoutsApi = async () => {
    try {
        const response = await api.get('/api/workout');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createWorkoutApi = async (WorkoutData) => {
    try {
        const response = await api.post('/api/workout', WorkoutData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    };
}

export const updateWorkoutApi = async (id, WorkoutData) => {
    try {
        const response = await api.put(`/api/workout/${id}`, WorkoutData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};
    
export const deleteWorkoutApi = async (id) => {
    try {
        const response = await api.delete(`/api/workout/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
}