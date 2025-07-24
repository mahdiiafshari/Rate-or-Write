import React, { useState } from 'react';
import api from '../api/base';
import { useNavigate } from 'react-router-dom';


function SignUp({ onSwitch }) {
  // Include all fields your backend requires
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // for file upload

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Prepare form data for multipart/form-data (to handle file upload)
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password2', confirmPassword);
      formData.append('bio', bio);
      formData.append('gender', gender);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await api.post(
        'users/register/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Registration success:', response.data);
      setSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      // Check if server sent validation errors
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed. Try again.');
      }
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Username:</label><br />
          <input
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Your username"
          />
        </div>

        <div className="form-group">
          <label>Email:</label><br />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label>Bio:</label><br />
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="form-group">
          <label>Gender:</label><br />
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Profile Picture:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label>Password:</label><br />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Choose a password"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label><br />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <p>
        Already have an account?{' '}
        <button onClick={onSwitch}>Sign In</button>
      </p>
    </div>
  );
}

export default SignUp;
