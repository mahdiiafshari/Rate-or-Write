import React from "react";

const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{user.username}'s Profile</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
                <p><strong>Bio:</strong> {user.bio || "No bio provided"}</p>
                <button onClick={onClose} style={styles.closeBtn}>Close</button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    modal: {
        background: "rgba(172, 0, 0, 0.5)",
        padding: "2rem",
        borderRadius: "8px",
        width: "400px",
        maxHeight: "80%",
        overflowY: "auto",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.3)"
    },
    closeBtn: {
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    }
};

export default UserProfileModal;
