/* eslint-disable import/named */
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';

import { Box, Input, Button, FormLabel, Typography, FormControl, CircularProgress } from '@mui/material';

import { VerifyUrl, ResetPassword, ResetForgotPasswordUrl } from '../../../API/Urls';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleInputChange = (field, value) => {
    setPasswords(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');

  const handleSubmit = () => {
    setLoading(true);

    const url = token ? ResetForgotPasswordUrl : ResetPassword;
    const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {};

    axios.post(url, passwords, { headers: tokenHeader })
      .then(res => {
        toast.success(res.data.message);
        navigate('/login');
      })
      .catch(error => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      axios.post(VerifyUrl + token)
        .then(res => {
          // Do something if needed
        })
        .catch(err => {
          toast.error(err.response.data.message);
          navigate('/login');
        });
    }
  }, [token, navigate]);

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        border="2px solid blue"
        width={500}
        padding={5}
        borderRadius={2}
        boxShadow={4}
        bgcolor="white"
      >
        <Typography variant="h5" color="primary" mb={4}>
          Password Reset
        </Typography>

        {loading ? (
          <Box textAlign="center" width={200}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box>
            {token ? (
              <>
                <FormControl fullWidth margin="normal">
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.new_password}
                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                  />
                </FormControl>

                <FormControl  fullWidth margin="normal">
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirm_password}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl  fullWidth margin="normal">
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter old password"
                    value={passwords.old_password}
                    onChange={(e) => handleInputChange('old_password', e.target.value)}
                  />
                </FormControl>

                <FormControl  fullWidth margin="normal">
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.new_password}
                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirm_password}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  />
                </FormControl>
              </>
            )}

            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PasswordReset;
