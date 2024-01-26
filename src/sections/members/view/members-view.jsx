/* eslint-disable */
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
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

import { addMember, editMember, getMembers, deleteMember } from 'src/store/thunk/member.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import MemberModal from './MemberModal';
import TableNoData from '../table-no-data';
import MemberTableRow from '../member-table-row';
import TableEmptyRows from '../table-empty-rows';
import MemberTableHead from '../member-table-head';
import MemberTableToolbar from '../member-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function MemberPage() {
  const dispatch = useDispatch();
  const memberData = useSelector((state) => state.members?.data);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [members, setMembers] = useState(memberData);
  const [memberEditData, setMemberEditData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState('');

  const handleModalClick = () => {
    setMemberEditData(null);
    setIsModalOpen(true);
  };

  const handleSaveMember = (memberData) => {
    dispatch(addMember({ memberData })).then((res) => {
      dispatch(getMembers()).then((res) => {
        setMembers(res.payload);
        toast.success('Member Added Succesfully');
      });
    });
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = () => {
    handleCancelDelete();
    dispatch(deleteMember(deleteId)).then((res) => {
      dispatch(getMembers()).then((res) => {
        setMembers(res.payload);
        toast.success('Member Deleted Succesfully');
      });
    });
  };

  const triggerEditMember = (rowData) => {
    setMemberEditData(rowData);
    // setIndexOfRow(index);
    setIsModalOpen(true);
  };

  const handleEditMember = (memberData) => {
    dispatch(editMember(memberData)).then((res) => {
      dispatch(getMembers()).then((res) => {
        setMembers(res.payload);
        toast.success('Member Edited Succesfully');
      });
    });
  };

  const handleBack = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // setIsLoading(true);
    dispatch(getMembers());
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
      const newSelecteds = memberData && memberData?.map((n) => n.name);
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
      inputData: memberData,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    setDataFiltered(filteredData);
  }, [memberData, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        members={members}
        onSave={handleSaveMember}
        editData={memberEditData}
        edit={handleEditMember}
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
        <Typography variant="h4">Members</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Member
        </Button>
      </Stack>

      <Card>
        <MemberTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MemberTableHead
                order={order}
                orderBy={orderBy}
                rowCount={memberData?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Role' },
                  { id: 'currentSalary', label: 'Current Salary' },
                  { id: 'department', label: 'Department' },
                  { id: 'team', label: 'Team' },
                  { id: 'contactNumber', label: 'Contact Number' },
                  { id: 'emergencyContactName', label: 'Emergency Contact Name' },
                  { id: 'emergencyContactNumber', label: 'Emergency Contact Number' },
                  { id: 'emergencyContactRelation', label: 'Emergency Contact Relation' },
                  { id: 'actions', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered &&
                  dataFiltered
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => (
                      <MemberTableRow
                        key={row?._id}
                        name={row?.name}
                        email={row?.email}
                        role={row?.role}
                        currentSalary={row?.currentSalary}
                        department={row?.department ? row?.department?.name : 'N/A'}
                        team={
                          row?.teams && row?.teams.length > 0
                            ? row?.teams?.map((team) => team?.name).join(', ')
                            : 'N/A'
                        }
                        contactNumber={row?.contactNumber ? row?.contactNumber : 'N/A'}
                        emergencyContactName={row?.emergencyContactName ?? 'N/A'}
                        emergencyContactNumber={row?.emergencyContactNumber ?? 'N/A'}
                        emergencyContactRelation={row?.emergencyContactRelation ?? 'N/A'}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleClickUpdate={() => triggerEditMember(row)}
                        handleClickDelete={() => handleClickDelete(row._id)}
                      />
                    ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, memberData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={memberData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
