import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroupPosts, getGroups, deleteGroup } from '../api/groups';

const Groupdetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Replace with your actual user context
  const currentUser = JSON.parse(localStorage.getItem('user')); // Or use AuthContext

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

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;

    try {
      setDeleting(true);
      await deleteGroup(groupId);
      navigate("/groups");
    } catch (err) {
      console.error("Failed to delete group:", err);
      alert("You are not authorized to delete this group.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading group details...</p>;
  if (!group) return <p>Group not found.</p>;

  const isOwner = currentUser && group.created_by.id === currentUser.id;

  return (
    <div className="group-detail">
      <Link to="/groups">← Back to Groups</Link>
      <h2>{group.name}</h2>
      <p>Total members: {group.users.length}</p>

      {isOwner && (
        <button onClick={handleDelete} disabled={deleting} style={{ margin: '1rem 0', background: 'red', color: 'white' }}>
          {deleting ? 'Deleting...' : 'Delete Group'}
        </button>
      )}

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
