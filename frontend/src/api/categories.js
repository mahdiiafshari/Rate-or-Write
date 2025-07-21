import axios from 'axios';
const CATEGORY_URL = 'http://localhost:8000/api/posts/categories/';

export const getCategories = () => axios.get(CATEGORY_URL);
