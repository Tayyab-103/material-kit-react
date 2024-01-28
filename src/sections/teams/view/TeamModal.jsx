/* eslint-disable */
import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import {
  Box,
  Modal,
  Button,
  FormLabel,
  Typography,
  FormControl,
  //   Select as MUISelect,
} from '@mui/material';

import { getMembers } from 'src/store/thunk/member.thunk';
import { getProjects } from 'src/store/thunk/project.thunk';

import { teamValidationSchema } from '../../../schema';
import { getDepartments } from '../../../store/thunk/department.thunk';

const TeamModal = ({ isOpen, onClose, teams, onSave, editData, edit }) => {
  const dispatch = useDispatch();

  const isUpdateMode = !!editData;
  const initialData = {
    name: editData?.name || '',
    technology: editData?.technology || '',
    department: editData?.department._id || '',
    team_head: editData?.team_head._id || '',
    members: editData?.members || [],
    projects: editData?.projects || [],
  };

//   console.log(initialData, 'Helloosncnsncxns========');
  const [teamData, setTeamData] = useState(initialData);
  const memberData = useSelector((state) => state.members?.data);
  const [members, setMembers] = useState(memberData);
  const departmentData = useSelector((state) => state.department?.data?.departments);
  const [departments, setDepartments] = useState(departmentData);
  const projectData = useSelector((state) => state.projects?.data);
  const [projects, setProjects] = useState(projectData);
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const handleModalClose = () => {
    onClose();
  };

  const handleSubmit = (values) => {
    if (editData) {
      edit(values);
    } else {
      onSave(values);
      setTeamData(initialData);
    }

    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getMembers()).then((res) => {
        setMembers(res.payload);
      });
      dispatch(getDepartments()).then((res) => {
        setDepartments(res.payload);
      });
      dispatch(getProjects()).then((res) => {
        setProjects(res.payload);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setTeamData(editData);
      setTeamData((prevData) => ({
        ...prevData,
        department: editData?.department?._id || '',
        team_head: editData?.team_head?._id || '',
        members: editData?.members?.map((member) => member._id) || '',
        projects: editData?.projects?.map((project) => project._id) || '',
      }));
    } else {
      setTeamData(initialData);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.members) {
      setSelectedMember(
        editData?.members?.map((member) => ({
          label: member.name,
          value: member._id,
        }))
      );
    } else {
      setSelectedMember([]);
    }
  }, [editData?.members]);

  useEffect(() => {
    if (editData?.projects) {
      setSelectedProject(
        editData?.projects?.map((project) => ({
          label: project.name,
          value: project._id,
        }))
      );
    } else {
      setSelectedProject([]);
    }
  }, [editData?.projects]);

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    padding: '10px',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '2px',
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
          {isUpdateMode ? 'Edit Team' : 'Add Team'}
        </Typography>
        <Formik
          initialValues={teamData}
          validationSchema={teamValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field type="text" name="name" id="name" placeholder="Name" style={inputStyle} />
              <ErrorMessage name="name" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Technology</FormLabel>
              <Field type="text" name="technology" placeholder="Technology" style={inputStyle} />
              <ErrorMessage name="technology" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Department</FormLabel>
              <Field as="select" name="department" placeholder="Department" style={inputStyle}>
                <option value="" disabled>
                  Select Department
                </option>
                {departments?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="department" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Team Head</FormLabel>
              <Field as="select" name="team_head" placeholder="Team Head" style={inputStyle}>
                <option value="" disabled>
                  Select Team Head
                </option>
                {members?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="team_head" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Members</FormLabel>
              <Field
                name="members"
                component={({ field, form }) => {
                  const onChange = (selectedOptions) => {
                    form.setFieldValue(
                      'members',
                      selectedOptions.map((option) => option.value)
                    );
                    setSelectedMember(selectedOptions);
                  };

                  return (
                    <Select
                      options={members?.map((row) => ({
                        value: row._id,
                        label: row.name,
                      }))}
                      isMulti
                      onChange={onChange}
                      value={selectedMember}
                      placeholder="Members"
                    />
                  );
                }}
              />
              <ErrorMessage name="members" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Projects</FormLabel>
              <Field
                name="projects"
                component={({ field, form }) => {
                  const onChange = (selectedOptions) => {
                    form.setFieldValue(
                      'projects',
                      selectedOptions.map((option) => option.value)
                    );
                    setSelectedProject(selectedOptions);
                  };

                  return (
                    <Select
                      options={projects?.map((row) => ({
                        value: row._id,
                        label: row.name,
                      }))}
                      isMulti
                      onChange={onChange}
                      value={selectedProject}
                      placeholder="projects"
                    />
                  );
                }}
              />
              <ErrorMessage name="projects" component="p" style={errorStyle} />
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

export default TeamModal;
