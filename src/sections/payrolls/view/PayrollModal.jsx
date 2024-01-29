/* eslint-disable */
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import { Box, Modal, Button, FormLabel, Typography, FormControl } from '@mui/material';

import { addPayRoll, getPayRoll, updatePayRoll } from 'src/store/thunk/payroll.thunk';

import { payrollValidationSchema } from '../../../schema';

const PayrollModal = ({
  isOpen,
  onClose,
  onBack,
  members,
  departments,
  payrollProp,
  payrollId,
}) => {
  const dispatch = useDispatch();
  const { payrolls } = useSelector((state) => state.payroll.data);
  const [payrollIds, setPayrollIds] = useState([]);
  const isUpdateMode = !!payrollId;

  useEffect(() => {
    if (payrolls) {
      setPayrollIds(payrolls.map((payroll) => payroll?.members?._id));
    }
  }, [payrolls]);

  const handleSubmit = async (value) => {
    try {
      if (payrollId) {
        await dispatch(updatePayRoll({ value, payrollId }));
        toast.success('PayRoll Edit successfully!');
      } else {
        await dispatch(addPayRoll(value));
        toast.success('PayRoll Add successfully!');
      }
      dispatch(getPayRoll());
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
          {isUpdateMode ? 'Edit PayRoll' : 'Add PayRoll'}
        </Typography>
        <Formik
          initialValues={{
            member: payrollProp?.member || '',
            department: payrollProp?.department || '',
            accountTitle: payrollProp?.accountTitle || '',
            cnic: payrollProp?.cnic || '',
            accountNo: payrollProp?.accountNo || '',
          }}
          validationSchema={payrollValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormControl fullWidth margin="normal">
              <FormLabel>Member</FormLabel>
              <Field
                as="select"
                name="member"
                placeholder="Member"
                style={inputStyle}
                disabled={isUpdateMode}
              >
                <option value="" disabled>
                  Select Member
                </option>
                {members &&
                  members
                    .filter((item) => !payrollIds.includes(item?._id))
                    .map((row) => (
                      <option key={row?._id} value={row?._id}>
                        {row?.name}
                      </option>
                    ))}
              </Field>
              <ErrorMessage name="member" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Department</FormLabel>
              <Field as="select" name="department" placeholder="Department" style={inputStyle}>
                <option value="" disabled>
                  Select Department
                </option>
                {departments &&
                  departments?.map((row, index) => (
                    <option key={row?._id} value={row?._id}>
                      {row?.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage name="department" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Account Title</FormLabel>
              <Field
                type="text"
                name="accountTitle"
                placeholder="Account Title"
                style={inputStyle}
              />
              <ErrorMessage name="accountTitle" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>CNIC</FormLabel>
              <Field type="text" name="cnic" placeholder="CNIC" style={inputStyle} />
              <ErrorMessage name="cnic" component="p" style={errorStyle} />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Account No</FormLabel>
              <Field type="text" name="accountNo" placeholder="Account No" style={inputStyle} />
              <ErrorMessage name="accountNo" component="p" style={errorStyle} />
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

export default PayrollModal;
