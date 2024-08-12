// userpage/UserPageContent.js
'use client'; // Ensure client-side rendering

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig'; // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import Chatbot from './Chatbot';

const UserPageContent = () => {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/Signin'); // Redirect to sign-in page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mt: 8 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to User Page
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
        {/* Render Chatbot with userDetails prop */}
        {userDetails && <Chatbot userDetails={userDetails} />}
      </Box>
    </Container>
  );
};

export default UserPageContent;
