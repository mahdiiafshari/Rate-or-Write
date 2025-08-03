import api from './base';

export const getAllUsers = async () => api.get('/users/');
export const getUserById = async id => api.get('/users/' + id);