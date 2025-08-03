import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroupPosts, getGroups, deleteGroup, leftFRomGroup, addMemberToGroup } from '../api/groups';
import { getAllUsers, getUserById } from '../api/users'; // you'll need an API for this
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

    const handleLeaveGroup = async () => {
        if (!window.confirm("Are you sure you want to leave this group?")) return;
        try {
            await leftFRomGroup(groupId);
            alert("You have left the group");
            navigate("/groups");
        } catch (err) {
            console.error("Failed to leave group", err);
            alert("Failed to leave the group");
        }
    };

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

    const openUserProfile = async (userId) => {
        try {
            const res = await getUserById(userId); // API to fetch a single user
            setSelectedUserProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch user profile", err);
        }
    };

    if (loading) return <p>Loading group details...</p>;
    if (!group) return <p>Group not found.</p>;

    const isOwner = currentUser && group.created_by.id === currentUser.id;
    const isMember = currentUser && group.users.some(u => u.id === currentUser.id);

    return (
        <div className="group-detail">
            <Link to="/groups">← Back to Groups</Link>
            <h2>{group.name}</h2>
            <p>Total members: {group.users.length}</p>

            <h4>Members:</h4>
            <ul>
                {group.users.map(user => (
                    <li key={`user-${user.id}`} style={{ cursor: "pointer", color: "blue" }} onClick={() => openUserProfile(user.id)}>
                        {user.username}
                    </li>
                ))}
            </ul>

            {isOwner && (
                <>
                    <button onClick={handleDelete} disabled={deleting}
                        style={{ background: 'red', color: 'white', marginRight: '1rem' }}>
                        {deleting ? 'Deleting...' : 'Delete Group'}
                    </button>

                    <button onClick={openAddMember} style={{ background: 'green', color: 'white' }}>
                        Add Member
                    </button>
                </>
            )}
            {isMember && !isOwner && (
                <button onClick={handleLeaveGroup} style={{ background: 'orange', color: 'white', marginTop: '1rem' }}>
                    Leave Group
                </button>
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
                    {posts.map(((post,index) => (
                        <li key={`post-${groupId}-${post.id}-${index}`}>
                            {post.post} by{" "}
                            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => openUserProfile(post.author_id)}>
                                {post.author}
                            </span>
                        </li>
                    )))}
                </ul>
            )}

            <UserProfileModal user={selectedUserProfile} onClose={() => setSelectedUserProfile(null)} />
        </div>
    );
};

export default Groupdetail;
