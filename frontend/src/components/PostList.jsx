import React, {useEffect, useState} from 'react';
import {fetchPosts, likePost} from '../api/posts';
import {getCollections, createCollection, addToCollection} from '../api/postCollections';
import {getGroups, sharePostToGroup} from '../api/groups';

import { v4 as uuidv4 } from 'uuid';
import {getUserById} from "../api/users.js";
import UserProfileModal from "./UserProfileModal.jsx";
export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
    const [addingPostIds, setAddingPostIds] = useState({});
    const [sharingPostIds, setSharingPostIds] = useState({});
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [postsRes, collectionsRes, groupsRes] = await Promise.all([
                fetchPosts(),
                getCollections(),
                getGroups()
            ]);
            setPosts(postsRes.data);
            setCollections(collectionsRes.data);
            setGroups(groupsRes.data);
        } catch (err) {
            console.error('Error loading data', err);
        }
    };

    const handleLike = async (postId) => {
        try {
            await likePost(postId);
            await loadData();
        } catch (err) {
            console.error('Error liking post', err);
        }
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionTitle.trim()) return;
        try {
            await createCollection({title: newCollectionTitle.trim()});
            setNewCollectionTitle('');
            await loadData();
        } catch (err) {
            console.error('Error creating collection', err);
        }
    };

    const handleAddToCollection = async (postId, collectionId) => {
        if (!collectionId) return;
        try {
            setAddingPostIds((prev) => ({...prev, [postId]: true}));
            await addToCollection(collectionId, postId);
            alert('Post added to playlist!');
            await loadData();
        } catch (err) {
            console.error('Error adding post to collection', err);
        } finally {
            setAddingPostIds((prev) => ({...prev, [postId]: false}));
        }
    };

    const handleShareToGroup = async (postId, groupId) => {
        if (!groupId) return;
        try {
            setSharingPostIds((prev) => ({...prev, [postId]: true}));
            await sharePostToGroup(groupId, postId);
            alert('Post shared to group!');
        } catch (err) {
            console.error('Error sharing post to group', err);
        } finally {
            setSharingPostIds((prev) => ({...prev, [postId]: false}));
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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>

            {/* Create playlist */}
            <form onSubmit={handleCreateCollection} className="form-group">
                <input
                    type="text"
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    placeholder="New Playlist Name"
                />
                <button
                    type="submit"
                >
                    ➕ Create Playlist
                </button>
            </form>

            {posts.map((post) => (
                <div
                    key={post.id}
                    className="border p-4 mb-4 rounded shadow-md bg-white space-y-2"
                >
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-gray-800">{post.post}</p>
                    <p style={{ color: "blue", cursor: "pointer" }}  onClick={() => openUserProfile(post.author_id)}>By: {post.author}</p>
                    <p className="text-sm text-gray-500">Category: {post.category}</p>
                    <p className="text-sm">{post.like_count} Likes</p>
                    {/* Like button */}
                        <button
                            className="like-button"
                            onClick={() => handleLike(post.id)}
                        >
                            {post.is_liked ? 'Unlike' : 'Like'}
                        </button>

                    <div className="flex gap-2 items-center">


                        {/* Add to Playlist */}
                        <select className= "select"
                            key={post.id + (addingPostIds[post.id] ? '-loading' : '')}
                            defaultValue=""
                            disabled={!!addingPostIds[post.id]}
                            onChange={(e) => handleAddToCollection(post.id, e.target.value)}
                        >
                            <option value="" disabled>
                                {addingPostIds[post.id] ? 'Adding...' : 'Add to Playlist'}
                            </option>
                            {collections.map((collection) => (
                                <option key={uuidv4()} value={collection.id}>
                                    {collection.title}
                                </option>
                            ))}
                        </select>

                        {/* Share to Group */}
                        <select
                            key={post.id + (sharingPostIds[post.id] ? '-sharing' : '')}
                            defaultValue=""
                            disabled={!!sharingPostIds[post.id]}
                            onChange={(e) => handleShareToGroup(post.id, e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="" disabled>
                                {sharingPostIds[post.id] ? 'Sharing...' : 'Share to Group'}
                            </option>
                            {groups.map((group) => (
                                <option key={uuidv4()} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <UserProfileModal user={selectedUserProfile} onClose={() => setSelectedUserProfile(null)} />
        </div>
    );
}
