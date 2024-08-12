"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, getAuth } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Updated import
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const Chatbot = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const response = await fetch('/api/userdetails');
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error('Failed to fetch user details');
        }
      } else {
        console.error('User is not authenticated');
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  };

  const sendMessage = async () => {
    if (loading || !message.trim()) return; // Prevent sending empty messages
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setMessage('');
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message }],
          userDetails,
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to send message:', response.statusText);
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      const processText = async ({ done, value }) => {
        if (done) return;
  
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });
  
        reader.read().then(processText);
      };
  
      reader.read().then(processText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  if (loading) return <div>Loading user details...</div>;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Chat Support
          </Typography>
          <Button color="inherit" onClick={handleSignOut} startIcon={<ExitToAppIcon />}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={drawerOpen}>
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'assistant' ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                }}
              >
                {message.role === 'assistant' && (
                  <Avatar
                    src="/assistant-avatar.png" // Correct path
                    alt="Assistant"
                    sx={{ mr: 1, width: 32, height: 32 }}
                  />
                )}
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: message.role === 'assistant' ? '#e3f2fd' : '#e8f5e9',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Box>
                {message.role === 'user' && (
                  <Avatar
                    src="/user-avatar.png"
                    alt="User"
                    sx={{ ml: 1, width: 32, height: 32 }}
                  />
                )}
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Main>
    </Box>
  );
};

export default Chatbot;
