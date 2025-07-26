import React, {useEffect, useState} from 'react';
import {competitionLists} from '../api/competition';
import api from '../api/base';

export default function CompetitionList() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userPosts, setUserPosts] = useState([]);

    // Fetch user posts (used for registration)
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

    // Fetch competition list
    useEffect(() => {
        competitionLists()
            .then((res) => {
                setCompetitions(res.data);
                setLoading(false);
            })
            .catch((err) => {
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
                    {competitions.map((competition) => (
                        <li
                            key={competition.id}
                            className="p-4 bg-white shadow rounded-lg border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-blue-700">{competition.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">
                                Status: <span className="font-medium">{competition.status}</span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Visibility: {competition.is_public ? 'Public' : 'Private'}
                            </p>
                            <p className="text-gray-700 mb-2">{competition.bio}</p>
                            <p className="text-gray-700 mb-2">User Registred:{competition.competitor_count}</p>
                            <p className="text-sm text-gray-500">
                                Category: <strong>{competition.category}</strong>
                            </p>

                            {/* ✅ Form to register with one of user's posts */}
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const postId = e.target.postId.value;

                                    if (!postId) {
                                        alert("Please select a post before registering.");
                                        return;
                                    }

                                    try {
                                        const res = await api.post('/competitions/register/', {
                                            competition_id: competition.id,
                                            post: postId,
                                        });
                                        const updatedCompetition = res.data.competition;

                                        // Update specific competition count in state
                                        setCompetitions(prev =>
                                            prev.map(c =>
                                                c.id === updatedCompetition.id ? {
                                                    ...c,
                                                    competitor_count: updatedCompetition.competitor_count
                                                } : c
                                            )
                                        );

                                        alert('Successfully registered!');
                                    } catch (err) {
                                        alert('Registration failed: ' + (err.response?.data?.detail || err.message));
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
                                >
                                    <option value="">-- Choose a post --</option>
                                    {userPosts.map((post) => (
                                        <option key={post.id} value={post.id}>
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Register
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
