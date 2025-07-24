import React, {useState} from 'react';
import {loginUser} from '../api/auth';
import {useNavigate} from "react-router-dom";

const SignIn = ({onSwitch}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            alert('Login successful!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Sign In</h2>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button className='login-btn' type="submit">Login</button>
            </form>

            <p>
                Create new account?{' '}
                <button className='login-btn' onClick={onSwitch}>Sign Up</button>
            </p>
        </div>
    );
};

export default SignIn;
