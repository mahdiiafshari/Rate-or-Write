import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/base';

export default function CompetitionRegisterPage() {
    const { id } = useParams();  // competition ID
    const [competition, setCompetition] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postId, setPostId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // const fetchCompetition = async () => {
        //     try {
        //         const res = await api.get(`competitions/${id}/`);
        //         setCompetition(res.data);
        //     } catch (err) {
        //         setError("Failed to load competition.");
        //     }
        // };

        const fetchUserPosts = async () => {
            try {
                const res = await axios.get('posts/mine/');  // adjust based on your API
                setPosts(res.data);
            } catch (err) {
                console.error("Could not fetch posts.");
            }
        };

        // fetchCompetition();
        fetchUserPosts();
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('competitions/register/', {
                competition: id,
                post: postId,
            });
            setMessage('Successfully registered!');
            setError('');
        } catch (err) {
            const msg = err.response?.data?.detail || "Registration failed.";
            setError(msg);
            setMessage('');
        }
    };

    if (!competition) return <p>Loading competition details...</p>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-blue-700">{competition.name}</h2>
            <p className="text-gray-600 mb-2">{competition.bio}</p>
            <p className="text-sm text-gray-500">Status: {competition.status}</p>

            <form onSubmit={handleRegister} className="mt-4 space-y-4">
                <label className="block text-sm font-medium">Select Your Post:</label>
                <select
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                >
                    <option value="">-- Choose a post --</option>
                    {posts.map((post) => (
                        <option key={post.id} value={post.id}>
                            {post.title}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}
