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

import { getClients } from 'src/store/thunk/client.thunk';
import { getMembers } from 'src/store/thunk/member.thunk';
import { deleteTask, getTask } from 'src/store/thunk/task.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TaskTableHead from '../task-table-head';
import TaskTableRow from '../task-table-row';
import TaskTableToolbar from '../task-table-toolbar';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import TaskModal from './TaskModal';
import { applyFilter, emptyRows, getComparator } from '../utils';
import Loader from 'src/components/loader/Loader';
import { getLeads } from 'src/store/thunk/lead.thunk';

// ----------------------------------------------------------------------

export default function TaskPage() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task.data);
  // console.log(tasks, ' Hello==== LeadsData');

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
  const [leads, setLeads] = useState([]);
  const [taskProp, setTaskProp] = useState({});
  const [taskId, setTaskId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleModalClick = () => {
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
    dispatch(getClients()).then((res) => {
      setClients(res.payload);
    });
    dispatch(getLeads()).then((res) => {
      setLeads(res.payload);
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
      setIsLoading(true);
      await dispatch(deleteTask(deleteId));
      await dispatch(getTask());
      toast.success('Task Deleted Successfully');
      setIsDeleteConfirmationOpen(false);
      setIsLoading(false);
    } catch (error) {
      // Display error toast
      toast.error('Error Deleting Task');
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleClickUpdate = (id, value) => {
    setTaskId(id);
    setTaskProp(value);
    // console.log("Update,", value);
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
    dispatch(getClients()).then((res) => {
      setClients(res.payload);
    });
    dispatch(getLeads()).then((res) => {
      setLeads(res.payload);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getTask());
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error fetching clients');
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
      const newSelecteds = tasks.map((n) => n.name);
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
      inputData: tasks,
      comparator: getComparator(order, orderBy),
      filterName,
    });
    setDataFiltered(filteredData);
  }, [tasks, order, orderBy, filterName]);

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
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        members={members}
        clients={clients}
        leads={leads}
        taskProp={taskProp}
        taskId={taskId}
      />
      <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Task</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Task
        </Button>
      </Stack>

      <Card>
        <TaskTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TaskTableHead
                order={order}
                orderBy={orderBy}
                rowCount={tasks.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'lead', label: 'Lead' },
                  { id: 'client', label: 'Client' },
                  { id: 'salesMember', label: 'Sales Member' },
                  { id: 'taskStartDate', label: 'Task Start Date' },
                  { id: 'taskEndDate', label: 'Task End Date' },
                  { id: 'isCompleted', label: 'IsCompleted' },
                  { id: 'taskSupervisor', label: ' Task Supervisor' },
                  { id: 'taskDiscription', label: ' Task Discription' },
                  { id: 'taskSideNote', label: 'Task Side Note' },
                  { id: 'taskLink1', label: 'Task Link1' },
                  { id: 'taskLink2', label: 'Task Link2' },
                  { id: 'taskLink3', label: 'Task Link3' },
                  { id: 'taskTechResources', label: 'Task Tech Resources' },
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
                        <TaskTableRow
                          key={row._id}
                          name={row.name}
                          lead={row?.lead?.name ?? "N/A"}
                          client={row?.client?.name ?? 'N/A'}
                          salesMember={row?.salesMember?.role ?? "N/A"}
                          taskStartDate={formatDateString(row?.taskStartDate)}
                          taskEndDate={formatDateString(row?.taskEndDate)}
                          isCompleted={row?.isCompleted ? "True" : "False"}
                          taskSupervisor={row?.taskSupervisor?.name ?? "N/A"}
                          taskDiscription={row?.taskDiscription}
                          taskSideNote={row?.taskSideNote}
                          taskLink1={row?.taskLink1}
                          taskLink2={row?.taskLink2}
                          taskLink3={row?.taskLink3}
                          taskTechResources={row?.taskTechResources?.length
                            ? row.taskTechResources.map(
                                (resource, index) => (
                                  <span key={index}>
                                    {resource.name}
                                    {index <
                                      row.taskTechResources
                                        .length -
                                        1 && ", "}
                                  </span>
                                )
                              )
                            : "N/A"}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          handleClickDelete={() => handleClickDelete(row._id)}
                          handleClickUpdate={() =>
                            handleClickUpdate(row._id, {
                              name: row?.name,
                              lead: row?.lead?._id,
                              client: row?.client?._id,
                              salesMember: row?.salesMember?._id,
                              taskDiscription: row?.taskDiscription,
                              taskSideNote: row?.taskSideNote,
                              taskStartDate: row?.taskStartDate,
                              taskEndDate: row?.taskEndDate,
                              taskSupervisor: row?.taskSupervisor?._id,
                              taskTechResources: row?.taskTechResources?.map(
                                (resource) => ({
                                  label: resource?.name,
                                  value: resource?._id,
                                  // isFixed: true
                                })
                              ),
                              taskLink1: row?.taskLink1,
                              taskLink2: row?.taskLink2,
                              taskLink3: row?.taskLink3,
                            })
                          }
                        />
                      ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, tasks.length)}
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
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
