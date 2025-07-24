import api from './base';


export const loginUser = async (email, password) => {
  const response = await api.post(`/token/`, {
    username: email,
    password: password,
  });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await api.post(`$/token/refresh/`, {
    refresh,
  });
  return response.data.access;
};
