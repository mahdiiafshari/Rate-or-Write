import api from './base';

export const getAllUsers = async () => api.get('/users/');