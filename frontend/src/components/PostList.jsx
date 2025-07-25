import React, { useEffect, useState } from 'react';
import { fetchPosts, likePost } from '../api/posts';
import { Link } from 'react-router-dom';

export default function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts()
            .then((res) => setPosts(res.data))
            .catch((err) => console.error('Error fetching posts', err));
    }, []);

    const handleLike = async (postId) => {
        try {
            await likePost(postId);
            const res = await fetchPosts();
            setPosts(res.data);
        } catch (err) {
            console.error('Error liking post', err);
        }
    };

    return (
        <div className="post-list-container">
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.post}</p>
                    <p className="like-count">{post.like_count} Likes</p>
                    <button
                        className="like-button"
                        onClick={() => handleLike(post.id)}
                    >
                        {post.is_liked ? 'Unlike' : 'Like'}
                    </button>
                    <p className="post-meta">By: {post.author}</p>
                    <p className="post-meta">Category: {post.category}</p>
                </div>
            ))}
        </div>
    );
}
