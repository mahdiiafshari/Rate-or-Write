// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className='navbar'>
      <nav>
        <Link to="/" style={{color: 'white', margin: '0 10px'}}>Home</Link>
        <Link to="/create-post" style={{color: 'white', margin: '0 10px'}}>Create Post</Link>
        <Link to="/login" style={{color: 'white', margin: '0 10px'}}>Login</Link>
      </nav>
    </header>
  );
}

export default Header;
