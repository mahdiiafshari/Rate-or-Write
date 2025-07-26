import api from './base';

export const competitionLists = async () => api.get(`/competitions`);