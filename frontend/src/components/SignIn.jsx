import React, { useState } from 'react';
import { loginUser } from '../api/auth';

const SignIn = ({onSwitch}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      alert('Login successful!');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
    <form onSubmit={handleLogin}>
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>

    </form>
        <p>
        Creat new account?{' '}
        <button onClick={onSwitch}>Sign Up</button>
      </p>
    </>


  );
};

export default SignIn;
