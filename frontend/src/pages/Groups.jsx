import React, { useEffect, useState } from 'react';
import { getGroups } from '../api/groups';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups()
      .then(res => {
        setGroups(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching groups:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="group-list">
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>You are not part of any groups yet.</p>
      ) : (
        <ul>
          {groups.map(group => (
            <li key={group.id}>
              <strong>{group.name}</strong> <br />
              Members: {group.users.length}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupList;
