import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroupPosts, getGroups, deleteGroup, leftFRomGroup, addMemberToGroup, changeMemberRole } from '../api/groups';
import { getAllUsers, getUserById } from '../api/users';
import UserProfileModal from '../components/UserProfileModal';

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
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [selectedRole, setSelectedRole] = useState('normal');
  const [changingRoleFor, setChangingRoleFor] = useState(null);

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
        console.error('Error loading group detail:', err);
        setLoading(false);
      });
  }, [groupId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      setDeleting(true);
      await deleteGroup(groupId);
      navigate('/groups');
    } catch (err) {
      console.error('Failed to delete group:', err);
      alert('You are not authorized to delete this group.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await leftFRomGroup(groupId);
      alert('You have left the group');
      navigate('/groups');
    } catch (err) {
      console.error('Failed to leave group', err);
      alert('Failed to leave the group');
    }
  };

  const openAddMember = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setShowAddUser(true);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleAddMember = async () => {
    try {
      await addMemberToGroup(groupId, { user_id: selectedUserId, role: selectedRole });
      alert('User added!');
      setShowAddUser(false);
      // Refresh group data to reflect new member
      const groupRes = await getGroups();
      const updatedGroup = groupRes.data.find(g => g.id === parseInt(groupId));
      setGroup(updatedGroup);
    } catch (err) {
      alert('Failed to add member');
      console.error(err);
    }
  };

  const openChangeRole = (userId) => {
    const membership = group.memberships.find(m => m.user.id === userId);
    setChangingRoleFor(userId);
    setSelectedRole(membership ? membership.role : 'normal');
  };

  const handleChangeRole = async (userId) => {
    try {
      await changeMemberRole(groupId, userId, { role: selectedRole });
      alert('User role updated!');
      setChangingRoleFor(null);
      // Refresh group data to reflect updated role
      const groupRes = await getGroups();
      const updatedGroup = groupRes.data.find(g => g.id === parseInt(groupId));
      setGroup(updatedGroup);
    } catch (err) {
      alert('Failed to update role');
      console.error(err);
    }
  };

  const openUserProfile = async (userId) => {
    try {
      const res = await getUserById(userId);
      setSelectedUserProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading group details...</p>;
  if (!group) return <p className="text-center text-red-500">Group not found.</p>;

  const currentUserMembership = group.memberships.find(m => m.user.id === currentUser?.id);
  const isOwner = currentUserMembership?.role === 'owner';
  const isAdminOrOwner = currentUserMembership && ['admin', 'owner'].includes(currentUserMembership.role);
  const isMember = !!currentUserMembership;

  return (
    <div className="container mx-auto p-4">
      <Link to="/groups" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Groups
      </Link>
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      <p className="text-gray-600">Total members: {group.memberships.length}</p>

      <h4 className="text-lg font-semibold mt-4">Members:</h4>
      <ul className="list-disc pl-5">
        {group.memberships.map(membership => (
          <li key={`user-${membership.user.id}`} className="flex items-center justify-between">
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => openUserProfile(membership.user.id)}
            >
              {membership.user.username} ({membership.role})
            </span>
            {isAdminOrOwner && membership.user.id !== currentUser.id && (
              changingRoleFor === membership.user.id ? (
                <div className="flex items-center">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border rounded p-1 mr-2"
                  >
                    <option value="banned">Banned</option>
                    <option value="normal">Normal</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    onClick={() => handleChangeRole(membership.user.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setChangingRoleFor(null)}
                    className="ml-2 bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openChangeRole(membership.user.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Change Role
                </button>
              )
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {deleting ? 'Deleting...' : 'Delete Group'}
          </button>
          <button
            onClick={openAddMember}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Member
          </button>
        </div>
      )}
      {isMember && !isOwner && (
        <button
          onClick={handleLeaveGroup}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Leave Group
        </button>
      )}

      {showAddUser && (
        <div className="border border-gray-300 p-4 mt-4 rounded">
          <h4 className="text-lg font-semibold">Select a user to add:</h4>
          <div className="flex space-x-4">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border rounded p-2"
            >
              <option value="normal">Normal</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleAddMember}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6">Shared Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts shared to this group yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {posts.map((post, index) => (
            <li key={`post-${groupId}-${post.id}-${index}`}>
              {post.post} by{' '}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => openUserProfile(post.author_id)}
              >
                {post.author}
              </span>
            </li>
          ))}
        </ul>
      )}

      <UserProfileModal user={selectedUserProfile} onClose={() => setSelectedUserProfile(null)} />
    </div>
  );
};

export default Groupdetail;