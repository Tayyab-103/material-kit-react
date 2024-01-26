/* eslint-disable */
import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import {
  Box,
  Modal,
  Radio,
  Button,
  Collapse,
  FormLabel,
  Typography,
  RadioGroup,
  IconButton,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { getTeams } from 'src/store/thunk/team.thunk';
import { getMembers } from 'src/store/thunk/member.thunk';
import { getClients } from 'src/store/thunk/client.thunk';

import { projectValidationSchema } from '../../../schema';

const ProjectModal = ({ isOpen, onClose, onSave, editData, edit }) => {
  const initialData = {
    name: editData?.name || '',
    tech_stack: editData?.tech_stack || '',
    team_lead: editData?.team_lead?._id || '',
    sales_coordinator: editData?.sales_coordinator?._id || '',
    teams_assigned: editData?.teams_assigned || [],
    members_assigned: editData?.members_assigned || [],
    platform: editData?.platform || '',
    contract_type: editData?.contract_type || '',
    client: editData?.client?._id || '',
    consultant: editData?.consultant || '',
    status: editData?.status || '',
    duration: editData?.duration || 0,
    duration_unit: editData?.duration || '',
    // start_date: editData?.start_date || '',
    start_date: editData?.start_date
      ? new Date(editData.start_date).toLocaleDateString('en-CA')
      : '',
    end_date: editData?.end_date ? new Date(editData.end_date).toLocaleDateString('en-CA') : '',
    // end_date: editData?.end_date || '',
    cost: editData?.cost || '',
  };

  //   console.log(initialData,"Helloooooo")
  const dispatch = useDispatch();
  const isUpdateMode = !!editData;
  const [projectData, setProjectData] = useState(initialData);
  const memberData = useSelector((state) => state.members?.data);
  const [members, setMembers] = useState(memberData);
  const teamData = useSelector((state) => state.teams?.data);
  const [teams, setTeams] = useState(teamData);
  const clientData = useSelector((state) => state.client?.data?.leads);
  const [clients, setClients] = useState(clientData);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userSelection, setUserSelection] = useState(null);

  const handleModalClose = () => {
    onClose();
    setUserSelection(null);
    setIsExpanded(false);
  };

  const handleUserSelection = (selection) => {
    setUserSelection(selection);
  };

  const sanitizeValues = (values) => {
    const sanitizedValues = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        sanitizedValues[key] = value;
      }
    });
    return sanitizedValues;
  };

  const handleSubmit = (values) => {
    const sanitizedValues = sanitizeValues(values);
    if (editData) {
      edit(sanitizedValues);
    } else {
      onSave(sanitizedValues);
      setProjectData(initialData);
    }

    setUserSelection(null);
    setIsExpanded(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getTeams()).then((res) => {
        setTeams(res.payload);
      });
      dispatch(getMembers()).then((res) => {
        setMembers(res.payload);
      });
      dispatch(getClients()).then((res) => {
        setClients(res.payload);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setUserSelection(
        editData?.teams_assigned &&
          editData?.teams_assigned.length > 0 &&
          editData?.members_assigned &&
          editData?.members_assigned.length > 0
          ? 'both'
          : editData?.teams_assigned && editData?.teams_assigned.length > 0
          ? 'teams'
          : editData?.members_assigned && editData?.members_assigned.length > 0
          ? 'members'
          : null
      );

      setProjectData(editData);
      setProjectData((prevData) => ({
        ...prevData,
        team_lead: editData?.team_lead?._id || '',
        sales_coordinator: editData?.sales_coordinator?._id || '',
        client: editData?.client?._id || '',
        teams_assigned: editData?.teams_assigned?.map((team) => team._id) || '',
        members_assigned: editData?.members_assigned?.map((member) => member._id) || '',
        start_date: new Date(editData?.start_date).toISOString().split('T')[0],
        end_date: new Date(editData?.end_date).toISOString().split('T')[0],
      }));
    } else {
      setProjectData(initialData);
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.teams_assigned) {
      setSelectedTeams(
        editData?.teams_assigned?.map((team) => ({
          label: team.name,
          value: team._id,
        }))
      );
    } else {
      setSelectedTeams([]);
    }
  }, [editData?.teams_assigned]);

  useEffect(() => {
    if (editData?.members_assigned) {
      setSelectedMember(
        editData?.members_assigned?.map((member) => ({
          label: member.name,
          value: member._id,
        }))
      );
    } else {
      setSelectedMember([]);
    }
  }, [editData?.members_assigned]);

  // Form Styles
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
      <div
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
          {isUpdateMode ? 'Edit Project' : 'Add Project'}
        </Typography>
        <Formik
          initialValues={projectData}
          validationSchema={projectValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field type="text" name="name" id="name" placeholder="Name" style={inputStyle} />
              <ErrorMessage name="name" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Tech Stack</FormLabel>
              <Field type="text" name="tech_stack" placeholder="Tech Stack" style={inputStyle} />
              <ErrorMessage name="tech_stack" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Team Lead</FormLabel>
              <Field as="select" name="team_lead" placeholder="Team Lead" style={inputStyle}>
                <option value="" disabled>
                  Select Team Lead
                </option>
                {members?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="team_lead" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Box display="flex" alignItems="center">
                <FormLabel mt={2}>Resources you want to assign</FormLabel>
                <IconButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  mb={2}
                >
                  {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Box>
              <Collapse in={isExpanded}>
                <RadioGroup
                  value={userSelection}
                  onChange={(e) => handleUserSelection(e.target.value)}
                >
                  <FormControlLabel value="teams" control={<Radio />} label="Teams" />
                  <FormControlLabel value="members" control={<Radio />} label="Members" />
                  <FormControlLabel value="both" control={<Radio />} label="Both" />
                </RadioGroup>
              </Collapse>
            </FormControl>
            {userSelection === 'teams' && (
              <FormControl fullWidth margin="normal">
                <FormLabel>Teams Assigned</FormLabel>
                <Field
                  name="teams_assigned"
                  component={({ field, form }) => {
                    const onChange = (selectedOptions) => {
                      form.setFieldValue(
                        'teams_assigned',
                        selectedOptions.map((option) => option.value)
                      );
                      setSelectedTeams(selectedOptions);
                    };

                    return (
                      <Select
                        options={teams?.map((row) => ({
                          value: row._id,
                          label: row.name,
                        }))}
                        isMulti
                        onChange={onChange}
                        value={selectedTeams}
                        placeholder="Teams Assigned"
                      />
                    );
                  }}
                />
                <ErrorMessage name="teams_assigned" component="p" style={errorStyle} />
              </FormControl>
            )}
            {userSelection === 'members' && (
              <FormControl fullWidth margin="normal">
                <FormLabel>Members Assigned</FormLabel>
                <Field
                  name="members_assigned"
                  component={({ field, form }) => {
                    const onChange = (selectedOptions) => {
                      form.setFieldValue(
                        'members_assigned',
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
                        placeholder="Members Assigned"
                      />
                    );
                  }}
                />
                <ErrorMessage name="members_assigned" component="p" style={errorStyle} />
              </FormControl>
            )}
            {userSelection === 'both' && (
              <>
                <FormControl fullWidth margin="normal">
                  <FormLabel>Teams Assigned</FormLabel>
                  <Field
                    name="teams_assigned"
                    component={({ field, form }) => {
                      const onChange = (selectedOptions) => {
                        form.setFieldValue(
                          'teams_assigned',
                          selectedOptions.map((option) => option.value)
                        );
                        setSelectedTeams(selectedOptions);
                      };

                      return (
                        <Select
                          options={teams?.map((row) => ({
                            value: row._id,
                            label: row.name,
                          }))}
                          isMulti
                          onChange={onChange}
                          value={selectedTeams}
                          placeholder="Teams Assigned"
                        />
                      );
                    }}
                  />
                  <ErrorMessage name="teams_assigned" component="p" style={errorStyle} />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <FormLabel>Members Assigned</FormLabel>
                  <Field
                    name="members_assigned"
                    component={({ field, form }) => {
                      const onChange = (selectedOptions) => {
                        form.setFieldValue(
                          'members_assigned',
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
                          placeholder="Members Assigned"
                        />
                      );
                    }}
                  />
                  <ErrorMessage name="members_assigned" component="p" style={errorStyle} />
                </FormControl>
              </>
            )}
            <FormControl fullWidth margin="normal">
              <FormLabel>Sales Coordinator</FormLabel>
              <Field
                as="select"
                name="sales_coordinator"
                placeholder="Sales Coordinator"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Sales Coordinator
                </option>
                {members?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="sales_coordinator" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Platform</FormLabel>
              <Field type="text" name="platform" placeholder="Platform " style={inputStyle} />
              <ErrorMessage name="platform" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Contract Type</FormLabel>
              <Field
                as="select"
                name="contract_type"
                placeholder="Contract Type"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Contract Type
                </option>
                <option value="Hourly">Hourly</option>
                <option value="Fixed">Fixed</option>
                <option value="Job">Job</option>
                <option value="Milestone">Milestone</option>
              </Field>
              <ErrorMessage name="contract_type" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Client</FormLabel>
              <Field as="select" name="client" placeholder="Client" style={inputStyle}>
                <option value="" disabled>
                  Select Client
                </option>
                {clients?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="client" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Consultant</FormLabel>
              <Field type="text" name="consultant" placeholder="Consultant" style={inputStyle} />
              <ErrorMessage name="consultant" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Stauts</FormLabel>
              <Field as="select" name="status" placeholder="Status" style={inputStyle}>
                <option value="" disabled>
                  Select Status
                </option>
                <option value="on-going">On-Going</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage name="status" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Duration</FormLabel>
              <Field type="number" name="duration" placeholder="Duration" style={inputStyle} />
              <ErrorMessage name="duration" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Duration Unit</FormLabel>
              <Field
                as="select"
                name="duration_unit"
                placeholder="Duration Unit"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Duration Unit
                </option>
                <option value="Months">Months</option>
                <option value="Weeks">Weeks</option>
                <option value="Days">Days</option>
              </Field>
              <ErrorMessage name="duration_unit" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Start Date</FormLabel>
              <Field type="date" name="start_date" placeholder="Start Date" style={inputStyle} />
              <ErrorMessage name="start_date" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>End Date</FormLabel>
              <Field type="date" name="end_date" placeholder="End Date" style={inputStyle} />
              <ErrorMessage name="end_date" component="p" style={errorStyle} />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>Cost</FormLabel>
              <Field type="text" name="cost" placeholder="Cost" style={inputStyle} />
              <ErrorMessage name="cost" component="p" style={errorStyle} />
            </FormControl>
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button onClick={handleModalClose} style={{ marginLeft: '10px' }}>
                Back
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export default ProjectModal;
