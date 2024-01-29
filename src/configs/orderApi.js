import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const getOrdersApi = async () => {
    try {
        const response = await api.get('/api/order');
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createOrderApi = async (orderData) => {
    try {
        const response = await api.post('/api/order', orderData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    };
}

export const updateOrderApi = async (id, orderData) => {
    try {
        const response = await api.put(`/api/order/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const deleteOrderApi = async (id) => {
    try {
        const response = await api.delete(`/api/order/${id}`);
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
