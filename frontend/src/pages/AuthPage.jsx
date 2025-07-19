// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

function AuthPage() {
  const [isSigningIn, setIsSigningIn] = useState(true);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      {isSigningIn ? (
        <SignIn onSwitch={() => setIsSigningIn(false)} />
      ) : (
        <SignUp onSwitch={() => setIsSigningIn(true)} />
      )}
    </div>
  );
}

export default AuthPage;
