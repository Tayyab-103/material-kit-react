/* eslint-disable */
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select as MUISelect,
  MenuItem,
  Modal,
  TextField,
  Typography
} from '@mui/material';

import { memberValidationSchema } from '../../../schema';
import { getDepartments } from '../../../store/thunk/department.thunk';
import { getTeams } from '../../../store/thunk/team.thunk';

const MemberModal = ({ isOpen, onClose, members, onSave, editData, edit }) => {
  const dispatch = useDispatch();

  const isUpdateMode = !!editData;

  const initialData = {
    name: editData?.name || '',
    email: editData?.email || '',
    contactNumber: editData?.contactNumber || '',
    role: editData?.role || '',
    currentSalary: editData?.currentSalary || '',
    department: editData?.department?._id || '',
    teams: editData?.teams || [],
    emergencyContactName: editData?.emergencyContactName || '',
    emergencyContactNumber: editData?.emergencyContactNumber || '',
    emergencyContactRelation: editData?.emergencyContactRelation || '',
  };
  // console.log(initialData, 'Helloosncnsncxns========');

  const [memberData, setMemberData] = useState(initialData);
  const teamData = useSelector((state) => state.teams?.data);
  const [teams, setTeams] = useState(teamData);
  const departmentData = useSelector((state) => state.department?.data?.departments);
  const [departments, setDepartments] = useState(departmentData);
  const [selected, setSelected] = useState([]);
  // console.log("edit",editData);
  const handleModalClose = () => {
    onClose();
  };

  const verifyEmail = (values) => {
    const emailExists = members?.filter((member) => member.email === values.email);
    return emailExists.length === 0; // If email does not exist, return true
  };

  const handleSubmit = async (values) => {
    // console.log(values,"jepakp===")
    try {
      if (editData) {
        await edit(values);
      } else {
        if (!verifyEmail(values)) {
          toast.error('Email already exists');
          return;
        }
        await onSave(values);
        setMemberData(initialData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, show error message, etc.
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getTeams()).then((res) => {
        setTeams(res.payload);
      });
      dispatch(getDepartments()).then((res) => {
        setDepartments(res.payload);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setMemberData(editData);
      setMemberData((prevData) => ({
        ...prevData,
        department: editData?.department?._id || '',
        teams: editData?.teams?.map((team) => team._id) || '',
      }));
      // console.log("data",memberData);
    } else {
      setMemberData(initialData);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.teams) {
      setSelected(
        editData?.teams?.map((team) => ({
          label: team.name,
          value: team._id,
        }))
      );
    } else {
      setSelected([]);
    }
  }, [editData?.teams]);

  const RoleOptions = ['', 'ADMIN', 'HR', 'BUSINESS_MANAGER', 'SALES_AGENT', 'TECH', 'HELPER'];

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
          {isUpdateMode ? 'Edit Member' : 'Add Member'}
        </Typography>
        <Formik
          initialValues={memberData}
          validationSchema={memberValidationSchema}
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
              <FormLabel>Email</FormLabel>
              <Field
                as={TextField}
                type="email"
                name="email"
                placeholder="Email"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Contact Number</FormLabel>
              <Field
                as={TextField}
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="contactNumber" component="p" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Role</FormLabel>
              <Field name="role">
                {({ field }) => (
                  <MUISelect {...field} placeholder="Role" variant="outlined" fullWidth>
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    {RoleOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </MUISelect>
                )}
              </Field>
              <ErrorMessage name="role" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Current Salary</FormLabel>
              <Field
                type="number"
                name="currentSalary"
                placeholder="Current Salary"
                variant="outlined"
                fullWidth
                as={TextField}
              />
              <ErrorMessage name="currentSalary" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Department</FormLabel>
              <Field name="department">
                {({ field }) => (
                  <MUISelect {...field} placeholder="Department" variant="outlined" fullWidth>
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    {departments?.map((option) => (
                     <MenuItem key={option._id} value={option._id}>
                    {option.name}
                   </MenuItem>
                    ))}
                  </MUISelect>
                )}
              </Field>
              <ErrorMessage name="department" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Teams</FormLabel>
              <Field
                as={TextField}
                name="teams"
                component={({ field, form }) => {
                  const onChange = (selectedOptions) => {
                    form.setFieldValue(
                      'teams',
                      selectedOptions.map((option) => option.value)
                    );
                    setSelected(selectedOptions);
                  };

                  return (
                    <Select
                      options={teams?.map((row) => ({
                        value: row._id,
                        label: row.name,
                      }))}
                      isMulti
                      onChange={onChange}
                      value={selected}
                      placeholder="Teams"
                    />
                  );
                }}
              />
              <ErrorMessage name="teams" component="div" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Emergency Contact Name</FormLabel>
              <Field
                type="text"
                name="emergencyContactName"
                placeholder="Emergency Contact Name"
                variant="outlined"
                fullWidth
                as={TextField}
              />
              <ErrorMessage name="emergencyContactName" component="p" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Emergency Contact Number</FormLabel>
              <Field
                type="text"
                name="emergencyContactNumber"
                placeholder="Emergency Contact Number"
                variant="outlined"
                fullWidth
                as={TextField}
              />
              <ErrorMessage name="emergencyContactNumber" component="p" style={{ color: 'red' }} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Emergency Contact Relation</FormLabel>
              <Field
                type="text"
                name="emergencyContactRelation"
                placeholder="Emergency Contact Relation"
                variant="outlined"
                fullWidth
                as={TextField}
              />
              <ErrorMessage
                name="emergencyContactRelation"
                component="p"
                style={{ color: 'red' }}
              />
            </FormControl>

            <Box style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button onClick={handleModalClose} style={{ marginLeft: '10px' }}>
                Back
              </Button>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Modal>
  );
};

export default MemberModal;
