import React, { useState, useEffect } from "react";
import { fetchUserStats, fetchUserFollowers, fetchUserFollowing } from "../api/users.js";

const UserProfileModal = ({ user, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [listType, setListType] = useState(null); // 'followers' | 'following'
  const [listData, setListData] = useState([]);

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

  const handleListClick = async (type) => {
    try {
      setListType(type);
      setListData([]); // Clear before loading
      if (type === "followers") {
        const followers = await fetchUserFollowers(user.id);
        setListData(followers);
      } else {
        const following = await fetchUserFollowing(user.id);
        setListData(following);
      }
    } catch (err) {
      console.error(`Failed to load ${type}`, err);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{selectedUser.username}'s Profile</h2>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Joined:</strong> {new Date(selectedUser.date_joined).toLocaleDateString()}</p>
        <p><strong>Bio:</strong> {selectedUser.bio || "No bio provided"}</p>

        <p>
          <strong>Followers:</strong>{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleListClick("followers")}
          >
            {selectedUser.follower_count || 0}
          </span>
        </p>
        <p>
          <strong>Following:</strong>{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleListClick("following")}
          >
            {selectedUser.following_count || 0}
          </span>
        </p>

        {listType && (
          <div className="list-section">
            <h3>{listType.charAt(0).toUpperCase() + listType.slice(1)}</h3>
            {listData.length > 0 ? (
              <ul>
                {listData.map((u) => (
                  <li key={u.id}>{u.username}</li>
                ))}
              </ul>
            ) : (
              <p>No {listType} found.</p>
            )}
          </div>
        )}

        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserProfileModal;
