import React, { useEffect, useState } from 'react';
import { getGroups, createGroup } from '../api/groups';
import { Link } from 'react-router-dom';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await getGroups();
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      return setError("Group name cannot be empty.");
    }

    setCreating(true);
    setError(null);
    try {
      await createGroup({ name: newGroupName });
      setNewGroupName('');
      await loadGroups(); // refresh group list
    } catch (err) {
      console.error("Create group error:", err);
      if (err.response && err.response.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError("Something went wrong while creating the group.");
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="group-list">
      <h2>Your Groups</h2>

      {/* Show group creation form only if user has < 5 groups */}
      {groups.length < 5 && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name"
            disabled={creating}
          />
          <button onClick={handleCreateGroup} disabled={creating}>
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {groups.length === 0 ? (
        <p>You are not part of any groups yet.</p>
      ) : (
        <ul>
          {groups.map(group => (
            <li key={group.id}>
              <Link to={`/groups/${group.id}`}>
                <strong>{group.name}</strong>
              </Link>
              <br />
              Members: {group.users.length}
            </li>
          ))}
        </ul>
      )}

      {groups.length >= 5 && (
        <p style={{ color: 'orange', marginTop: '1rem' }}>
          You've reached the group creation limit (5 groups).
        </p>
      )}
    </div>
  );
};

export default GroupList;
