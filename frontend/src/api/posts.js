import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/posts/';
const token = localStorage.getItem('access');

export const fetchPosts = () => axios.get(BASE_URL);
export const fetchPost = (id) => axios.get(`${BASE_URL}${id}/`);
export const createPost = (data) => {
  const token = localStorage.getItem('access');

  return axios.post('http://localhost:8000/api/posts/', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    }
  });
};
export const updatePost = (id, data) => axios.put(`${BASE_URL}${id}/`, data);
export const deletePost = (id) => axios.delete(`${BASE_URL}${id}/`);
