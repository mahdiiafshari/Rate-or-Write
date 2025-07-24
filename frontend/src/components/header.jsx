import React from 'react';
import {Link} from 'react-router-dom';


function Header() {
    const token = localStorage.getItem('access');

    return (
        <header className="navbar">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/create-post">Create Post</Link>

                {token ? (
                    <Link to="/profile">Profile</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
