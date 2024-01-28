/* eslint-disable react/prop-types */
import Select from "react-select";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import { Box, Modal, Button, FormLabel, Typography, FormControl } from '@mui/material';

import { addTask, getTask, updateTask } from 'src/store/thunk/task.thunk';

import { taskValidationSchema } from '../../../schema';

const TaskModal = ({ isOpen, onClose, onBack, members, clients, leads, taskProp, taskId }) => {
  const dispatch = useDispatch();
  const isUpdateMode = !!taskId;
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (taskProp?.taskTechResources) {
      setSelected(taskProp?.taskTechResources);
    }
    // console.log(taskProp?.taskTechResources,"Task")
  }, [taskProp?.taskTechResources]);

  const handleSubmit = async (value) => {
    try {
      if (taskId) {
        await dispatch(updateTask({ value, taskId }));
        toast.success('Lead Edit successfully!');
      } else {
        console.log('add', value);
        await dispatch(addTask(value));
        toast.success('Lead Add successfully!');
      }
      dispatch(getTask());
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
          {isUpdateMode ? 'Edit Task' : 'Add Task'}
        </Typography>
        <Formik
          initialValues={{
            name: taskProp?.name || '',
            lead: taskProp?.lead || '',
            client: taskProp?.client || '',
            salesMember: taskProp?.salesMember || '',
            taskDiscription: taskProp?.taskDiscription || '',
            taskSideNote: taskProp?.taskSideNote || '',
            taskStartDate: taskProp?.taskStartDate
              ? new Date(taskProp.taskStartDate).toLocaleDateString('en-CA')
              : '',
            taskEndDate: taskProp?.taskEndDate
              ? new Date(taskProp.taskEndDate).toLocaleDateString('en-CA')
              : '',
            taskSupervisor: taskProp?.taskSupervisor || '',
            taskTechResources: taskProp?.taskTechResources || [],
            taskLink1: taskProp?.taskLink1 || '',
            taskLink2: taskProp?.taskLink2 || '',
            taskLink3: taskProp?.taskLink3 || '',
          }}
          validationSchema={taskValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Name</FormLabel>
              <Field type="text" name="name" id="name" placeholder="Name" style={inputStyle} />
              <ErrorMessage name="name" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Lead</FormLabel>
              <Field as="select" name="lead" placeholder="lead" style={inputStyle}>
                <option value="" disabled>
                  Select Lead
                </option>
                {leads &&
                  leads?.map((row, index) => (
                      <option key={row?._id} value={row?._id}>
                        {row?.name}
                      </option>
                    ))}
              </Field>
              <ErrorMessage name="lead" component="p" style={errorStyle} />
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
              <FormLabel>Sales Member</FormLabel>
              <Field as="select" name="salesMember" placeholder="Sales Member" style={inputStyle}>
                <option value="" disabled>
                  Select Role Member
                </option>

                {members &&
                  members
                    ?.filter((row) => row.role === 'BUSINESS_MANAGER' || row.role === 'SALES_AGENT')
                    ?.map((row, index) => 
                      // console.log(row, "members")
                       (
                        <option key={row?._id} value={row?._id}>
                          {row?.name}
                        </option>
                      )
                    )}
              </Field>
              <ErrorMessage name="salesMember" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Discription</FormLabel>
              <Field
                type="text"
                name="taskDiscription"
                placeholder="Task Discription"
                style={inputStyle}
              />
              <ErrorMessage name="taskDiscription" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Side Note</FormLabel>
              <Field
                type="text"
                name="taskSideNote"
                placeholder="Task Side Note"
                style={inputStyle}
              />
              <ErrorMessage name="taskSideNote" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Start Date</FormLabel>
              <Field
                type="date"
                name="taskStartDate"
                placeholder="Task Start Date"
                style={inputStyle}
              />
              <ErrorMessage name="taskStartDate" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task End Date</FormLabel>
              <Field
                type="date"
                name="taskEndDate"
                placeholder="Task End Date"
                style={inputStyle}
              />
              <ErrorMessage name="taskEndDate" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Supervisor</FormLabel>
              <Field
                as="select"
                name="taskSupervisor"
                placeholder="Task Supervisor"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Supervisor
                </option>
                {members &&
                  members?.map((row, index) => (
                    <option key={row?._id} value={row?._id}>
                      {row?.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage name="taskSupervisor" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Tech Resources</FormLabel>
              <Field
                name="taskTechResources"
                component={({ field, form }) => {
                  const onChange = (selectedOptions) => {
                    form.setFieldValue(
                      'taskTechResources',
                      selectedOptions.map((option) => option.value)
                    );
                    setSelected(selectedOptions);
                  };

                  return (
                    <Select
                      options={members?.map((row) => ({
                        value: row._id,
                        label: row.name,
                      }))}
                      isMulti
                      onChange={onChange}
                      value={selected}
                      placeholder="Task Tech Resources"
                    />
                  );
                }}
              />
              <ErrorMessage name="taskTechResources" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Link 1</FormLabel>
              <Field type="text" name="taskLink1" placeholder="Task Link 1" style={inputStyle} />
              <ErrorMessage name="taskLink1" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Link 2</FormLabel>
              <Field type="text" name="taskLink2" placeholder="Task Link 2" style={inputStyle} />
              <ErrorMessage name="taskLink2" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Task Link 3</FormLabel>
              <Field type="text" name="taskLink3" placeholder="Task Link 3" style={inputStyle} />
              <ErrorMessage name="taskLink3" component="p" style={errorStyle} />
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

export default TaskModal;
