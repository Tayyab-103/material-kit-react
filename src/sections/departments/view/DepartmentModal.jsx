/* eslint-disable react/prop-types */
import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import {
  Modal,
  Button,
  Select,
  FormLabel,
  TextField,
  Typography,
  FormControl,
} from '@mui/material';

import { departmentValidationSchema } from '../../../schema';
import {
  addDepartments,
  getDepartments,
  updateDepartments,
} from '../../../store/thunk/department.thunk';

const DepartmentModal = ({ isOpen, onClose, onBack, members, formProp, departmentId }) => {
  const dispatch = useDispatch();
  const isUpdateMode = !!departmentId;

  const handleSubmit = async (values) => {
    try {
      if (departmentId) {
        // Update existing Department
        await dispatch(updateDepartments({ value: values, departmentId }));
        toast.success('Department Edit successfully!');
      } else {
        // Add new Department
        await dispatch(addDepartments(values));
        toast.success('Department Add successfully!');
      }

      // Refresh Departments after the update
      dispatch(getDepartments());

      // Close the modal after submitting
      onClose();
    } catch (error) {
      // Display error toast
      toast.error('An error occurred. Please try again.');
    }
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
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h6" id="modal-title">
          {isUpdateMode ? 'Edit Department' : 'Add Department'}
        </Typography>
        <Formik
          initialValues={{
            name: formProp?.name || '',
            departmentHead: formProp?.departmentHead || '',
          }}
          validationSchema={departmentValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field
                as={TextField}
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Department Head</FormLabel>
              <Field
                as={Select}
                name="departmentHead"
                placeholder="Select Department Head"
                variant="outlined"
                fullWidth
                native // Use native for native select element
                label="Department Head" // Add a label for accessibility
              >
                <option value="">Select Department Head</option>
                {members &&
                  members?.map((row, index) => (
                    <option key={row?._id} value={row?._id}>
                      {row?.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage name="departmentHead" component="div" style={{ color: 'red' }} />
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
      </div>
    </Modal>
  );
};

export default DepartmentModal;
