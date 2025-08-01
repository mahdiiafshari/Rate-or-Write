import api from './base';

export const getGroups = async () => api.get(`/groups`);
export const getGroupPosts = (groupId) => api.get(`/groups/${groupId}/posts`);
export const deleteGroup = (groupId) => api.delete(`/groups/${groupId}/delete/`);
export const createGroup = (data) => {return api.post('/groups/create/', data);};
export const addMemberToGroup = (groupId, data) => {
  return api.post(`/groups/${groupId}/add-member/`, data);
};