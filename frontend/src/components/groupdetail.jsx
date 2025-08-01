import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroupPosts, getGroups, deleteGroup } from '../api/groups';
import { addMemberToGroup } from '../api/groups';
import { getAllUsers } from '../api/users';

const Groupdetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));

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
    if (!window.confirm("Are you sure you want to delete this group?")) return;
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

  const openAddMember = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setShowAddUser(true);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleAddMember = async () => {
    try {
      await addMemberToGroup(groupId, { user_id: selectedUserId });
      alert("User added!");
      setShowAddUser(false);
    } catch (err) {
      alert("Failed to add member");
      console.error(err);
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
        <>
          <button onClick={handleDelete} disabled={deleting} style={{ background: 'red', color: 'white', marginRight: '1rem' }}>
            {deleting ? 'Deleting...' : 'Delete Group'}
          </button>

          <button onClick={openAddMember} style={{ background: 'green', color: 'white' }}>
            Add Member
          </button>
        </>
      )}

      {showAddUser && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
          <h4>Select a user to add:</h4>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <br /><br />
          <button onClick={handleAddMember}>Add</button>
          <button onClick={() => setShowAddUser(false)} style={{ marginLeft: '1rem' }}>Cancel</button>
        </div>
      )}

      <h3>Shared Posts</h3>
      {posts.length === 0 ? (
        <p>No posts shared to this group yet.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.post}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Groupdetail;
