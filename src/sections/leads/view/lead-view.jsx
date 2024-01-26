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
import { getClients } from 'src/store/thunk/client.thunk';
import { getLeads, deleteLeads } from 'src/store/thunk/lead.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import LeadModal from './LeadModal';
import TableNoData from '../table-no-data';
import LeadTableRow from '../lead-table-row';
import LeadTableHead from '../lead-table-head';
import TableEmptyRows from '../table-empty-rows';
import LeadTableToolbar from '../lead-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function LeadPage() {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.lead.data);
  console.log(leads, ' Hello==== LeadsData');

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [leadProp, setLeadProp] = useState({});
  const [leadId, setLeadId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const handleModalClick = () => {
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });

    dispatch(getClients()).then((res) => {
      setClients(res.payload);
    });
  };

  const handleBack = () => {
    setIsModalOpen(false); 
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // setIsLoading(true);
      await dispatch(deleteLeads(deleteId));
      await dispatch(getLeads());

      // Display success toast
      toast.success("Lead Deleted Successfully");

      // Close confirmation modal
      setIsDeleteConfirmationOpen(false);
      // setIsLoading(false);
    } catch (error) {
      // Display error toast
      toast.error("Error Deleting Lead");
      // setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleClickUpdate = (id, value) => {
    setLeadId(id);
    setLeadProp(value);
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
    dispatch(getClients()).then((res) => {
      setClients(res.payload);
    });
  };

  useEffect(() => {
    dispatch(getLeads());
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
      const newSelecteds = leads.map((n) => n.name);
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
      inputData: leads,
      comparator: getComparator(order, orderBy),
      filterName,
    });
    setDataFiltered(filteredData);
  }, [leads, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  function formatDateString(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/
                        ${date.getDate().toString().padStart(2, '0')}/
                        ${date.getFullYear()}`;

    return formattedDate;
  }
  return (
    <Container>
       <LeadModal
        isOpen={isModalOpen}
        members={members}
        clients={clients}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        leadProp={leadProp}
        leadId={leadId}
      />
       <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this lead?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Leads</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Lead
        </Button>
      </Stack>

      <Card>
        <LeadTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <LeadTableHead
                order={order}
                orderBy={orderBy}
                rowCount={leads.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'date', label: 'Date' },
                  { id: 'salesTeamMember', label: 'Sales TeamMember' },
                  { id: 'client', label: 'Client' },
                  { id: 'appointment', label: 'Appointment' },
                  { id: 'leadStatus', label: 'Lead Status' },
                  { id: 'linkJobApplied', label: 'Link Job Applied' },
                  { id: 'jobDescription', label: 'Job Description' },
                  { id: 'sentDescription', label: 'sentDescription' },
                  { id: 'call', label: 'Call' },
                  { id: 'actions', label: 'Actions', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered &&
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <LeadTableRow
                        key={row._id}
                        name={row.name}
                        date={formatDateString(row?.date)}
                        salesTeamMember={row?.salesTeamMember?.name ?? 'N/A'}
                        client={row?.client?.name ?? 'N/A'}
                        appointment={formatDateString(row?.appointment)}
                        leadStatus={row?.leadStatus}
                        linkJobApplied={row?.linkJobApplied}
                        jobDescription={row?.jobDescription}
                        sentDescription={row?.sentDescription}
                        call={formatDateString(row?.call)}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleClickDelete={() => handleClickDelete(row._id)}
                        handleClickUpdate={() =>
                          handleClickUpdate(row._id, {
                            name: row?.name,
                            date: row?.date,
                            salesTeamMember: row?.salesTeamMember?._id,
                            client: row?.client?._id,
                            linkJobApplied: row?.linkJobApplied,
                            jobDescription: row?.jobDescription,
                            sentDescription: row?.sentDescription,
                            appointment: row?.appointment,
                            call: row?.call,
                            leadStatus: row?.leadStatus,
                          })
                        }
                      />
                    ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, leads.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
