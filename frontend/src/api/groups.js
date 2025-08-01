import api from './base';

export const getGroups = async () => api.get(`/groups`);
export const getGroupPosts = (groupId) => api.get(`/groups/${groupId}/posts`);
export const deleteGroup = (groupId) => api.get(`/groups/${groupId}/delete`);
export const createGroup = (data) => {return api.post('/groups/create/', data);};