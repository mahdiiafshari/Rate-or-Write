import React, { useState, useEffect } from "react";
import { fetchUserStats } from "../api/users.js";

const UserProfileModal = ({ user, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user) {
      const loadStats = async () => {
        try {
          const stats = await fetchUserStats(user.id);
          setSelectedUser({ ...user, ...stats });
        } catch (err) {
          console.error("Failed to load user stats", err);
          setSelectedUser(user);
        }
      };
      loadStats();
    }
  }, [user]);

  if (!selectedUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{selectedUser.username}'s Profile</h2>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Joined:</strong> {new Date(selectedUser.date_joined).toLocaleDateString()}</p>
        <p><strong>Bio:</strong> {selectedUser.bio || "No bio provided"}</p>
        <p><strong>Followers:</strong> {selectedUser.follower_count || 0}</p>
        <p><strong>Following:</strong> {selectedUser.following_count || 0}</p>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserProfileModal;
