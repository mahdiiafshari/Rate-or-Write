import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage  from './pages/AuthPage';
import Home from './pages/index.jsx';
function App() {
  return(
  <Router>
      <Routes>
        <Route path= '/' element={<Home/>}/>
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>);
}

export default App;
