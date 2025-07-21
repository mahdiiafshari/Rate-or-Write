import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/token/`, {
    username: email,
    password: password,
  });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await axios.post(`${API_URL}/token/refresh/`, {
    refresh,
  });
  return response.data.access;
};
