/* eslint-disable react/prop-types */
import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import {Box, Modal, Button, FormLabel, Typography, FormControl } from '@mui/material';

import { addClients, getClients, updateClients } from 'src/store/thunk/client.thunk';

import { clientValidationSchema } from '../../../schema';

const ClientModal = ({ isOpen, onClose, onBack, clientProp, clientId }) => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.client.data);
  const isUpdateMode = !!clientId;

  const verifyEmail = (values) => {
    const emailExists = clients?.filter((client) => client.email === values.email);
    if (emailExists[0]?.email) {
      return false;
    }
    return true;
  };
  const SecondaryEmail = (values) => {
    const emailSecondaryExists = clients?.filter(
      (client) => client.emailSecondary === values.emailSecondary
    );
    if (emailSecondaryExists[0]?.emailSecondary) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (value) => {
    try {
      if (clientId) {
        await dispatch(updateClients({ value, clientId }));
        toast.success('Client Edit successfully!');
      } else {
        if (!verifyEmail(value)) {
          toast.error('Email already exists');
          return;
        }
        if (!SecondaryEmail(value)) {
          toast.error('Email Secondary already exists');
          return;
        }
        await dispatch(addClients(value));
        toast.success('Client Add successfully!');
      }
      dispatch(getClients());

      onClose();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };
  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    padding: '10px',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '5px',
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" id="modal-title">
          {isUpdateMode ? 'Edit Client' : 'Add Client'}
        </Typography>
        <Formik
          initialValues={{
            name: clientProp?.name || '',
            email: clientProp?.email || '',
            emailSecondary: clientProp?.emailSecondary || '',
            contactNumber: clientProp?.contactNumber || '',
            platform: clientProp?.platform || '',
            dateContacted: clientProp?.dateContacted
              ? new Date(clientProp.dateContacted).toLocaleDateString('en-CA')
              : '',
            regionLocated: clientProp?.regionLocated || '',
            contactPlatformLink1: clientProp?.contactPlatformLink1 || '',
            contactPlatformLink2: clientProp?.contactPlatformLink2 || '',
          }}
          validationSchema={clientValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl  fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field type="text" name="name" id="name" placeholder="Name" style={inputStyle} />
              <ErrorMessage name="name" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Email</FormLabel>
              <Field type="email" name="email" placeholder="Email" style={inputStyle} />
              <ErrorMessage name="email" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Email Secondary</FormLabel>
              <Field
                type="email"
                name="emailSecondary"
                placeholder="Email Secondary"
                style={inputStyle}
              />
              <ErrorMessage name="emailSecondary" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Contact Number</FormLabel>
              <Field
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                style={inputStyle}
              />
              <ErrorMessage name="contactNumber" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Platform</FormLabel>
              <Field type="text" name="platform" placeholder="Platform" style={inputStyle} />
              <ErrorMessage name="platform" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Date Contacted</FormLabel>
              <Field
                type="date"
                name="dateContacted"
                placeholder="Date Contacted"
                style={inputStyle}
              />
              <ErrorMessage name="dateContacted" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Region Located</FormLabel>
              <Field
                type="text"
                name="regionLocated"
                placeholder="Region Located"
                style={inputStyle}
              />
              <ErrorMessage name="regionLocated" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Contact Platform Link1</FormLabel>
              <Field
                type="text"
                name="contactPlatformLink1"
                placeholder="Contact Platform Link1"
                style={inputStyle}
              />
              <ErrorMessage name="contactPlatformLink1" component="p" style={errorStyle} />
            </FormControl>

            <FormControl  fullWidth margin="normal">
              <FormLabel>Contact Platform Link2</FormLabel>
              <Field
                type="text"
                name="contactPlatformLink2"
                placeholder="Contact Platform Link2"
                style={inputStyle}
              />
              <ErrorMessage name="contactPlatformLink2" component="p" style={errorStyle} />
            </FormControl>

            <Box style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button onClick={onBack} style={{ marginLeft: '10px' }}>
                Back
              </Button>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Modal>
  );
};

export default ClientModal;
