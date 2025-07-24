import api from './base';

export const fetchPosts = () => api.get('posts/');
export const fetchPost = (id) => api.get(`posts/${id}/`);
export const createPost = (data) => {
  return api.post('posts/', data)
};
export const updatePost = (id, data) => api.put(`posts/${id}/`, data);
export const deletePost = (id) => api.delete(`posts/${id}/`);
