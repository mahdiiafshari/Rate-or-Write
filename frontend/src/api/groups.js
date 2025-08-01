import api from './base';

export const getGroups = async () => api.get(`/groups`);
export const getGroupPosts = (groupId) => api.get(`/groups/${groupId}/posts`);