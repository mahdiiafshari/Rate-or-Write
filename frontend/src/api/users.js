import api from './base';

export const getAllUsers = async () => api.get('/users/');
export const getUserById = async id => api.get('/users/' + id);
// Follow a user
export const followUser = (userId) => api.post('/follows/', { following_id: userId });
// Unfollow a user
export const unfollowUser = (followId) => api.delete(`/follows/${followId}/`);
// Fetch follow stat
export const fetchUserStats = async (userId) => {
  const res = await api.get(`/follows/stats/`, {
    params: { user_id: userId },
  });
  return res.data;
};
