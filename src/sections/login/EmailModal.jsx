/* eslint-disable */
import { toast } from 'react-toastify';
import React, { useState } from 'react';

import {
  Input,
  Button,
  Dialog,
  FormLabel,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

const EmailModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email) {
      toast.error('Please Enter Your Email');
      return;
    }

    const Email = {
      email,
    };

    onSubmit(Email);
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth margin="normal">
      <DialogTitle>Forget Password</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your existing email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailModal;
