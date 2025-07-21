import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, updatePost, deletePost } from '../api/posts';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchPost(id).then(res => setFormData(res.data)).catch(console.error);
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    await updatePost(id, formData);
    alert("Updated successfully!");
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      await deletePost(id);
      navigate('/');
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Edit Post</h2>
      <input name="title" value={formData.title} onChange={handleChange} className="border p-2 w-full" />
      <textarea name="post" value={formData.post} onChange={handleChange} className="border p-2 w-full" />
      <input name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full" />
      <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <div className="space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
        <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </form>
  );
}
