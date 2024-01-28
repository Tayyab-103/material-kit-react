/* eslint-disable react/prop-types */
import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import {
  Box,
  Modal,
  Button,
  FormLabel,
  Typography,
  FormControl,
} from '@mui/material';

import { addLeads, getLeads, updateLeads } from 'src/store/thunk/lead.thunk';

import { leadValidationSchema } from '../../../schema';



const LeadModal = ({ isOpen, onClose, onBack, members, clients, leadProp, leadId }) => {
  const dispatch = useDispatch();
  const isUpdateMode = !!leadId;

  const handleSubmit = async (value) => {
    try {
      if (leadId) {
        // Update existing Client
        await dispatch(updateLeads({ value, leadId }));
        toast.success('Lead Edit successfully!');
      } else {
        // Add new Lead
        await dispatch(addLeads(value));
        toast.success('Lead Add successfully!');
      }

      // Refresh Clients after the update
      dispatch(getLeads());

      // Close the modal after submitting
      onClose();
    } catch (error) {
      // Display error toast
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
          {isUpdateMode ? 'Edit Lead' : 'Add Lead'}
        </Typography>
        <Formik
          initialValues={{
            name: leadProp?.name || '',
            date: leadProp?.date ? new Date(leadProp.date).toLocaleDateString('en-CA') : '',
            salesTeamMember: leadProp?.salesTeamMember || '',
            client: leadProp?.client || '',
            linkJobApplied: leadProp?.linkJobApplied || '',
            jobDescription: leadProp?.jobDescription || '',
            sentDescription: leadProp?.sentDescription || '',
            appointment: leadProp?.appointment
              ? new Date(leadProp.appointment).toLocaleDateString('en-CA')
              : '',
            call: leadProp?.call ? new Date(leadProp.call).toLocaleDateString('en-CA') : '',
            leadStatus: leadProp?.leadStatus || '',
          }}
          validationSchema={leadValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field type="text" name="name" id="name" placeholder="Name" style={inputStyle} />
              <ErrorMessage name="name" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Date</FormLabel>
              <Field type="date" name="date" placeholder="Date" style={inputStyle} />
              <ErrorMessage name="date" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Sales Team Member</FormLabel>
              <Field
                as="select"
                name="salesTeamMember"
                placeholder="Sales Team Member"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Sales Team Member
                </option>
                {members &&
                  members?.map((row, index) => (
                    <option key={row?._id} value={row?._id}>
                      {row?.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage name="salesTeamMember" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Client</FormLabel>
              <Field as="select" name="client" placeholder="Client" style={inputStyle}>
                <option value="" disabled>
                  Select Client
                </option>
                {clients &&
                  clients?.map((row, index) => 
                    // console.log(row, "Clients")
                     (
                      <option key={row?._id} value={row?._id}>
                        {row?.name}
                      </option>
                    )
                  )}
              </Field>
              <ErrorMessage name="client" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Link Job Applied</FormLabel>
              <Field
                type="text"
                name="linkJobApplied"
                placeholder="Link Job Applied"
                style={inputStyle}
              />
              <ErrorMessage name="linkJobApplied" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Job Description</FormLabel>
              <Field
                type="text"
                name="jobDescription"
                placeholder="Job Description"
                style={inputStyle}
              />
              <ErrorMessage name="jobDescription" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Sent Description</FormLabel>
              <Field
                type="text"
                name="sentDescription"
                placeholder="Sent Description"
                style={inputStyle}
              />
              <ErrorMessage name="sentDescription" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Appointment</FormLabel>
              <Field type="date" name="appointment" placeholder="Appointment" style={inputStyle} />
              <ErrorMessage name="appointment" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Call</FormLabel>
              <Field type="date" name="call" placeholder="Call" style={inputStyle} />
              <ErrorMessage name="call" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Lead Status</FormLabel>
              <Field as="select" name="leadStatus" placeholder="Lead Status" style={inputStyle}>
                <option value="" disabled>
                  Select Client
                </option>
                <option value="HOT">HOT</option>
                <option value="WARM">WARM</option>
                <option value="COLD">COLD</option>
              </Field>
              <ErrorMessage name="leadStatus" component="p" style={errorStyle} />
            </FormControl>
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button onClick={onBack} style={{ marginLeft: '10px' }}>
                Back
              </Button>
            </div>
          </Form>
        </Formik>
      </Box>
    </Modal>
  );
};

export default LeadModal;
