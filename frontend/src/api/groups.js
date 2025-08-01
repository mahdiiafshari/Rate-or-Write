import api from './base';

export const getGroups = async () => api.get(`/groups`);