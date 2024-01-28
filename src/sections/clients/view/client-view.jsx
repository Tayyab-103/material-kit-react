/* eslint-disable */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { deleteClients, getClients } from 'src/store/thunk/client.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ClientTableHead from '../client-table-head';
import ClientTableRow from '../client-table-row';
import ClientTableToolbar from '../client-table-toolbar';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';
import ClientModal from './ClientModal';
import Loader from 'src/components/loader/Loader';

// ----------------------------------------------------------------------

export default function ClientPage() {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.client.data);
  // console.log(clients, ' Hello==== LeadsData');

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [clientProp, setClientProp] = useState({});
  const [clientId, setClientId] = useState("");
  const [deleteId, setDeleteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const handleModalClick = () => {
    setIsModalOpen(true);
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
      setIsLoading(true);
      await dispatch(deleteClients(deleteId));
      await dispatch(getClients());
      toast.success("Client Deleted Successfully");
      setIsDeleteConfirmationOpen(false);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error Deleting Client");
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleClickUpdate = (id, value) => {
    setClientId(id);
    setClientProp(value);
    setIsModalOpen(true);
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getClients())
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching clients");
      }
    };

    fetchData();
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
      const newSelecteds = clients.map((n) => n.name);
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
      inputData: clients,
      comparator: getComparator(order, orderBy),
      filterName,
    });
    setDataFiltered(filteredData);
  }, [clients, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        clientProp={clientProp}
        clientId={clientId}
      />
      <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this client?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Clients</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Client
        </Button>
      </Stack>

      <Card>
        <ClientTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ClientTableHead
                order={order}
                orderBy={orderBy}
                rowCount={clients.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'contactNumber', label: 'Contact Number' },
                  { id: 'platform', label: 'Platform' },
                  { id: 'regionLocated', label: 'Region Located' },
                  { id: 'isActive', label: 'IsActive' },
                  { id: 'isOnBoarded', label: 'IsOn Boarded' },
                  { id: 'emailSecondary', label: 'Email Secondary' },
                  { id: 'dateContacted', label: 'Date Contacted' },
                  { id: 'contactPlatformLink1', label: 'Contact Platform Link1' },
                  { id: 'contactPlatformLink2', label: 'Contact Platform Link2' },
                  { id: 'actions', label: 'Actions', align: 'center' },
                ]}
              />
              {/* Loader */}
              {isLoading && <Loader />}
              {!isLoading && (
                <TableBody>
                  {dataFiltered &&
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <ClientTableRow
                          key={row._id}
                          name={row.name}
                          email={row?.email}
                          contactNumber={row?.contactNumber}
                          platform={row?.platform}
                          regionLocated={row?.regionLocated}
                          isActive={row?.isActive ? "True" : "False"}
                          linkJobApplied={row?.linkJobApplied}
                          jobDescription={row?.jobDescription}
                          sentDescription={row?.sentDescription}
                          isOnBoarded={row?.isOnBoarded ? "True" : "False"}
                          emailSecondary={row?.emailSecondary}
                          dateContacted={new Date(
                            row?.dateContacted
                          ).toLocaleDateString()}
                          contactPlatformLink1={row?.contactPlatformLink1}
                          contactPlatformLink2={row?.contactPlatformLink2}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          handleClickDelete={() => handleClickDelete(row._id)}
                          handleClickUpdate={() =>
                            handleClickUpdate(row._id, {
                              name: row.name,
                              email: row.email,
                              emailSecondary: row.emailSecondary,
                              contactNumber: row.contactNumber,
                              platform: row.platform,
                              dateContacted: row.dateContacted,
                              regionLocated: row.regionLocated,
                              contactPlatformLink1: row.contactPlatformLink1,
                              contactPlatformLink2: row.contactPlatformLink2,
                            })
                          }
                        />
                      ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, clients.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={clients.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
