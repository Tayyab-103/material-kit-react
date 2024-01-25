/* eslint-disable */

import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import DialogContentText from '@mui/material/DialogContentText';

import { getMembers } from 'src/store/thunk/member.thunk';
import { getDepartments, deleteDepartments } from 'src/store/thunk/department.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import DepartmentModal from './DepartmentModal';
import TableEmptyRows from '../table-empty-rows';
import DepartmentTableRow from '../department-table-row';
import DepartmentTableHead from '../department-table-head';
import DepartmentTableToolbar from '../department-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function DepartmentPage() {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department.data);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [members, setMembers] = useState([]);
  const [formProp, setFormProp] = useState({});
  const [departmentId, setDepartmentId] = useState('');

  const handleModalClick = () => {
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // setIsLoading(true);
      await dispatch(deleteDepartments(deleteId));
      await dispatch(getDepartments());

      // Display success toast
      toast.success('Department Deleted Successfully');
      setIsDeleteConfirmationOpen(false);
      // setIsLoading(false);
    } catch (error) {
      toast.error('Error Deleting Department');
      // setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleClickUpdate = (id, value) => {
    setDepartmentId(id);
    setFormProp(value);
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
  };

  const handleBack = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getDepartments());
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = departments && departments?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  useEffect(() => {
    const filteredData = applyFilter({
      inputData: departments,
      comparator: getComparator(order, orderBy),
      filterName,
    });
    setDataFiltered(filteredData);
  }, [departments, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        members={members}
        formProp={formProp}
        departmentId={departmentId}
      />

      <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this department?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Departments </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Department
        </Button>
      </Stack>

      <Card>
        <DepartmentTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DepartmentTableHead
                order={order}
                orderBy={orderBy}
                rowCount={departments?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'departmentHead', label: 'Department Head' },
                  { id: 'email', label: 'Eamil' },
                  // { id: 'isVerified', label: 'Verified', align: 'center' },
                  // { id: 'status', label: 'Status' },
                  // { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered &&
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DepartmentTableRow
                        key={row._id}
                        name={row.name}
                        departmentHead={row?.departmentHead?.name}
                        email={row?.departmentHead?.email}
                        // status={row.status}
                        // company={row.company}
                        // avatarUrl={row.avatarUrl}
                        // isVerified={row.isVerified}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleClickDelete={() => handleClickDelete(row._id)}
                        handleClickUpdate={() =>
                          handleClickUpdate(row._id, {
                            name: row.name,
                            departmentHead: row.departmentHead._id,
                          })
                        }
                      />
                    ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, departments?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={departments?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
