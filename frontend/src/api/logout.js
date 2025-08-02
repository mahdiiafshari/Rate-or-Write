import api from './base';


export const logoutUser = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return;

  try {
    await api.post('users/logout/', { refresh });
  } catch (e) {
    console.warn('Logout failed:', e);
  } finally {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  }
};