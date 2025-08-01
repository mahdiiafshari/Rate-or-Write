import React, { useEffect, useState } from 'react';
import { fetchPosts, likePost } from '../api/posts';
import { getCollections, createCollection, addToCollection } from '../api/postCollections.js';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [addingPostIds, setAddingPostIds] = useState({}); // track loading per post

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsRes, collectionsRes] = await Promise.all([
        fetchPosts(),
        getCollections(),
      ]);
      setPosts(postsRes.data);
      setCollections(collectionsRes.data);
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
      await createCollection({ title: newCollectionTitle.trim() });
      setNewCollectionTitle('');
      await loadData();
    } catch (err) {
      console.error('Error creating collection', err);
    }
  };

  const handleAddToCollection = async (postId, collectionId) => {
    if (!collectionId) return;
    try {
      // Mark loading for this postId
      setAddingPostIds((prev) => ({ ...prev, [postId]: true }));
      await addToCollection(collectionId, postId);
      alert('Post added to playlist!');
      // Reset the dropdown value after success by forcing re-render of selects (see below)
      await loadData();
    } catch (err) {
      console.error('Error adding post to collection', err);
    } finally {
      setAddingPostIds((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      <form onSubmit={handleCreateCollection} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
          placeholder="New Playlist Name"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
          <p className="text-sm text-gray-500">By: {post.author}</p>
          <p className="text-sm text-gray-500">Category: {post.category}</p>
          <p className="text-sm">{post.like_count} Likes</p>

          <div className="flex gap-2 items-center">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleLike(post.id)}
            >
              {post.is_liked ? 'Unlike' : 'Like'}
            </button>

            <select
              key={post.id + (addingPostIds[post.id] ? '-loading' : '')} // force reset by changing key on loading toggle
              defaultValue=""
              disabled={!!addingPostIds[post.id]}
              onChange={(e) => {
                handleAddToCollection(post.id, e.target.value);
              }}
              className="border px-2 py-1 rounded"
            >
              <option value="" disabled>
                {addingPostIds[post.id] ? 'Adding...' : 'Add to Playlist'}
              </option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
