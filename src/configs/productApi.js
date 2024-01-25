import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
    baseURL,
});

export const deleteProductApi = async (idProduct) => {
    try {
        const response = await api.delete(`/api/product/${idProduct}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const createProductApi = async (productData) => {
    try {
        const response = await api.post('/api/product', productData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};

export const updateProductApi = async (id, productData) => {
    try {
        const response = await api.put(`/api/product/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error('Ошибка:' + error);
        throw error;
    }
};