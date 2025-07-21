import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts()
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">All Posts</h1>
      <Link to="/create" className="text-blue-500">+ New Post</Link>
      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border p-2 rounded">
            <Link to={`/${post.id}`} className="text-lg text-blue-600">{post.title}</Link>
            <p className="text-sm text-gray-500">By {post.author}, Status: {post.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
