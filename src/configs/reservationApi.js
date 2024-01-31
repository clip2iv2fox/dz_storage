import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getReservationsApi = async () => {
    try {
        const response = await api.get('/api/reservation');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createReservationApi = async (reservationData) => {
    try {
        const response = await api.post('/api/reservation', reservationData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    };
}

export const updateReservationApi = async (id, reservationData) => {
    try {
        const response = await api.put(`/api/reservation/${id}`, reservationData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deleteReservationApi = async (id) => {
    try {
        const response = await api.delete(`/api/reservation/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
}

export const deleteDayApi = async (day) => {
    try {
        const response = await api.delete('/api/day', { data: { date: day } });
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};
