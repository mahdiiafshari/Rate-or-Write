import React, { useEffect, useState } from 'react';
import { getAllUsers, followUser, unfollowUser } from '../api/users.js';

const UserList = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
  try {
    await followUser(userId);
    fetchUsers(); // refetch to update follow_id
  } catch (err) {
    console.error('Follow failed', err);
  }
};


  const handleUnfollow = async (userId, followId) => {
  try {
    await unfollowUser(followId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_following: false, follow_id: null } : u
      )
    );
  } catch (err) {
    console.error('Unfollow failed', err);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>People</h2>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px',
            borderBottom: '1px solid #ccc',
          }}
        >
          <span>{user.username}</span>
          {user.id !== currentUserId && (
            user.is_following ? (
              <button
                onClick={() => handleUnfollow(user.id, user.follow_id)}
                style={{ background: 'red', color: 'white', border: 'none', padding: '4px 8px' }}
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                style={{ background: 'blue', color: 'white', border: 'none', padding: '4px 8px' }}
              >
                Follow
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
