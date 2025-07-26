import api from './base';

export const competitionLists = async () => api.get(`/competitions`);

export async function registerForCompetition({ competitionId, postId }, token) {
    try {
        const response = await base.post(
            `/competition/register/`,
            {
                competition_id: competitionId,
                post: postId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || 'Registration failed.');
        }
        throw new Error('Network or server error.');
    }
}