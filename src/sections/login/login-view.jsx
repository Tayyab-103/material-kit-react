/* eslint-disable */
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import login from 'src/store/thunk/auth.thunk';
import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';


import { ForgetPasswordUrl } from '../../API/Urls';
import EmailModal from './EmailModal';


// ----------------------------------------------------------------------

export default function LoginView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // const navigate = useHistory();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const handleSubmit = (email) => {
    axios
      .post(ForgetPasswordUrl, email)
      .then((res) => {
        console.log('res', res);
        toast.success('Kindly check your Email');
      })
      .catch((err) => {
        console.log('Error', err);

        toast.error(err.response.data.message);
      });
  };

  // Validations
  const isValidEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const emailError = email && !isValidEmailPattern ? 'Please enter a valid email address.' : '';

  const handleSignIn = () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    if (emailError) {
      toast.error(emailError);
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    if (password.length < 5) {
      toast.error('Minimum length of password is 5');
      return;
    }

    // setLoading(true);
    dispatch(login({ email, password, navigate}))
      .then((res) => {
        // setLoading(false);
      })
      .catch((error) => {
        console.error('Error', error);
        // toast.error(error?.response?.data?.message || "An error occurred");
        // setLoading(false);
      });
  };

  // const handleClick = () => {
  //   router.push('/dashboard');
  // };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
        <Button onClick={() => setIsModalOpen(true)}>Forgot password?</Button>
        <EmailModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        // onClick={handleClick}
        onClick={handleSignIn}
        sx={{
          backgroundColor: 'blue',
          '&:hover': {
            backgroundColor: 'darkblue',
          },
        }}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">SignIn TDC Dashboard</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          {/* <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
