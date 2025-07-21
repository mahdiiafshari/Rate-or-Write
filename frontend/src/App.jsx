import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage  from './pages/AuthPage';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import Home from './pages/index.jsx';
function App() {
  return(
  <Router>
      <Routes>
        <Route path= '/' element={<Home/>}/>
        <Route path="/login" element={<AuthPage />} />
          <Route path="/posts" element={<PostList />} />
        <Route path="/create-post" element={<PostForm />} />
        <Route path="/:id" element={<PostDetail />} />
      </Routes>
    </Router>);
}

export default App;
