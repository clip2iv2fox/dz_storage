import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getFlightsApi = async () => {
    try {
        const response = await api.get('/api/flight');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createFlightApi = async (flightData) => {
    try {
        const response = await api.post('/api/flight', flightData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    };
}

export const updateFlightApi = async (id, flightData) => {
    try {
        const response = await api.put(`/api/flight/${id}`, flightData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};
    
export const deleteFlightApi = async (id) => {
    try {
        const response = await api.delete(`/api/flight/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
}