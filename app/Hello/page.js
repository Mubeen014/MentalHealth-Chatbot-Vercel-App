// app/Hello/page.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

const TestPage = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Page
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Back to Home Page
        </Button>
      </Link>
    </Container>
  );
};

export default TestPage;
