import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupPosts, getGroups } from '../api/groups';

const Groupdetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getGroups(), getGroupPosts(groupId)])
      .then(([groupRes, postRes]) => {
        const g = groupRes.data.find(g => g.id === parseInt(groupId));
        setGroup(g);
        setPosts(postRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading group detail:", err);
        setLoading(false);
      });
  }, [groupId]);

  if (loading) return <p>Loading group details...</p>;
  if (!group) return <p>Group not found.</p>;

  return (
    <div className="group-detail">
      <Link to="/groups">← Back to Groups</Link>
      <h2>{group.name}</h2>
      <p>Total members: {group.users.length}</p>

      <h3>Shared Posts</h3>
      {posts.length === 0 ? (
        <p>No posts shared to this group yet.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              {post.post}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Groupdetail;
