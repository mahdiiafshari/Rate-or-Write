import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {logoutUser} from "../api/logout.js";


function Header() {
    const token = localStorage.getItem('access');
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser();
        navigate('/');
    };


    return (
        <header className="navbar">
            <nav>
                <Link className='btn-shared' to="/">Home</Link>
                <Link className='btn-shared' to="/create-post">Create Post</Link>
                <Link className='btn-shared' to="/competition">Competition List</Link>
                <Link className='btn-shared' to="/groups">Groups</Link>
                <Link className='btn-shared' to="/follow">Follow</Link>
                {token ? (
                    <>
                        <Link className='btn-shared' to="/profile">Profile</Link>
                        <button className='btn-shared' onClick={handleLogout} style={{marginLeft: '10px'}}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link className='btn-shared' to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
