import React, { useEffect, useState } from 'react';
import { competitionLists } from '../api/competition';

export default function CompetitionList() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                            <p className="text-sm text-gray-600 mb-2">Status: <span className="font-medium">{competition.status}</span></p>
                            <p className="text-sm text-gray-600 mb-2">Visibility: {competition.is_public ? 'Public' : 'Private'}</p>
                            <p className="text-gray-700 mb-2">{competition.bio}</p>
                            <p className="text-sm text-gray-500">Category: <strong>{competition.category}</strong></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
