'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

const UserDetailsPage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      } else {
        router.push('/signin'); // Redirect to signin if not authenticated
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [router]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { name, age, sex });
        // Remove the redirect here, so the user stays on the same page after saving
      } catch (error) {
        console.error('Error saving user details:', error);
        setError('Failed to save user details. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Details
        </Typography>
        {userDetails ? (
          <>
            <Typography variant="body1" gutterBottom>
              Welcome back, {userDetails.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Age: {userDetails.age}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Sex: {userDetails.sex}
            </Typography>
            {/* Add a button to go to the chat page */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/userpage/chatbot')}
              sx={{ mt: 2 }}
            >
              Go to Chat
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Age"
              fullWidth
              margin="normal"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <TextField
              label="Sex"
              fullWidth
              margin="normal"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            {/* Show the Go to Chat button after saving */}
            {user && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/userpage/chatbot')}
                sx={{ mt: 2 }}
              >
                Go to Chat
              </Button>
            )}
          </>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default UserDetailsPage;
