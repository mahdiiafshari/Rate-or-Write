import React, {useEffect, useState} from 'react';
import {competitionLists} from '../api/competition';
import api from '../api/base';

export default function CompetitionList() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [submittingId, setSubmittingId] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts/mine/');
                setUserPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch posts', err);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        competitionLists()
            .then(res => {
                setCompetitions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch competitions.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading competitions...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Competitions</h1>

            {competitions.length === 0 ? (
                <p className="text-center text-gray-500">No competitions available.</p>
            ) : (
                <ul className="space-y-4">
                    {competitions.map(competition => (
                        <li key={competition.id} className="p-4 bg-white shadow rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-blue-700">{competition.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">
                                Status: <span className="font-medium">{competition.status}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Visibility: {competition.is_public ? 'Public' : 'Private'}
                            </p>
                            <p className="text-gray-700 mb-2">{competition.bio}</p>
                            <p className="text-gray-700 mb-2">
                                User Registered: {competition.competitor_count || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                Category: <strong>{competition.category}</strong>
                            </p>

                            <form
                                onSubmit={async e => {
                                    e.preventDefault();
                                    const postId = e.target.postId.value;
                                    if (!postId) {
                                        alert('Please select a post before registering.');
                                        return;
                                    }
                                    setSubmittingId(competition.id);
                                    try {
                                        const res = await api.post('/competitions/register/', {
                                            competition_id: competition.id,
                                            post: postId,
                                        });
                                        const competitionsRes = await competitionLists();  // fetch latest competitions list
                                        setCompetitions(competitionsRes.data);            // update state with fresh data
                                        alert('Successfully registered!');
                                    } catch (err) {
                                        alert('Registration failed: ' + (err.response?.data?.detail || err.message));
                                    } finally {
                                        setSubmittingId(null);
                                    }
                                }}
                                className="mt-4"
                            >
                                <label htmlFor={`post-${competition.id}`} className="block text-sm mb-1">
                                    Select your post
                                </label>
                                <select
                                    name="postId"
                                    id={`post-${competition.id}`}
                                    className="w-full border border-gray-300 rounded p-2 mb-2"
                                    disabled={submittingId === competition.id}
                                >
                                    <option value="">-- Choose a post --</option>
                                    {userPosts.map(post => (
                                        <option key={post.id} value={post.id}>
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={submittingId === competition.id}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {submittingId === competition.id ? 'Registering...' : 'Register'}
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
