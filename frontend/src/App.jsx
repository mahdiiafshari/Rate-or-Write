import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage  from './pages/AuthPage';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import Header from './components/Header';
import Profile from './components/profile';


function App() {
  return(
  <Router>
      <Header/>
      <Routes>
        <Route path= '/' element={<PostList />}/>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/create-post" element={<PostForm />} />
        <Route path="/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </Router>);
}

export default App;
