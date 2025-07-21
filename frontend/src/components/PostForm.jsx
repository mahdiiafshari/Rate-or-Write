import React, { useState, useEffect } from 'react';
import { createPost } from '../api/posts';
import { getCategories } from '../api/categories';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const [formData, setFormData] = useState({
    title: '',
    post: '',
    category_id: '', // assuming you use category_id as FK
    status: 'draft',
  });
  const [categories, setCategories] = useState([]); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data)
        console.log(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPost(formData);
      navigate('/');
    } catch (err) {
      console.error('Create failed', err.response?.data || err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Create Post</h2>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="border p-2 w-full" required />
      <textarea name="post" placeholder="Content" value={formData.post} onChange={handleChange} className="border p-2 w-full" required />

      <select name="category_id" value={formData.category_id} onChange={handleChange} className="border p-2 w-full" required>
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
