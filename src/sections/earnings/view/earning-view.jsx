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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import DialogContentText from '@mui/material/DialogContentText';

import { getMembers } from 'src/store/thunk/member.thunk';
import { getProjects } from 'src/store/thunk/project.thunk';
import { getDepartments } from 'src/store/thunk/department.thunk';
import { getEarning, deleteEarning } from 'src/store/thunk/earning.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import Loader from 'src/components/loader/Loader';

import EarningModal from './EarningModal';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import EarningTableRow from '../earning-table-row';
import EarningTableHead from '../earning-table-head';
import EarningTableToolbar from '../earning-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function EarningPage() {
  const dispatch = useDispatch();
  const { earnings } = useSelector((state) => state.earning.data);
  // console.log(earnings, ' Hello==== LeadsData');

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
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [earningProp, setEarningProp] = useState({});
  const [earningId, setEarningId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleModalClick = () => {
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
    dispatch(getDepartments()).then((res) => {
      setDepartments(res.payload);
    });
    dispatch(getProjects()).then((res) => {
      setProjects(res.payload);
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
      await dispatch(deleteEarning(deleteId));
      await dispatch(getEarning());
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
    setEarningId(id);
    setEarningProp(value);
    setIsModalOpen(true);
    dispatch(getMembers()).then((res) => {
      setMembers(res.payload);
    });
    dispatch(getDepartments()).then((res) => {
      setDepartments(res.payload);
    });
    dispatch(getProjects()).then((res) => {
      setProjects(res.payload);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getEarning());
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
      const newSelecteds = earnings?.map((n) => n.name);
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
      inputData: earnings,
      comparator: getComparator(order, orderBy),
      filterName,
    });
    setDataFiltered(filteredData);
  }, [earnings, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <EarningModal
        isOpen={isModalOpen}
        members={members}
        projects={projects}
        departments={departments}
        onClose={() => setIsModalOpen(false)}
        onBack={handleBack}
        earningProp={earningProp}
        earningId={earningId}
      />
      <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Earning</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this earning?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Earnings</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Earning
        </Button>
      </Stack>

      <Card>
        <EarningTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EarningTableHead
                order={order}
                orderBy={orderBy}
                rowCount={earnings.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'member', label: 'Member' },
                  { id: 'department', label: 'Department' },
                  { id: 'currentSalary', label: 'Current Salary' },
                  { id: 'projectsAssigned', label: 'Projects Assigned' },
                  { id: 'projectsWorkedOn', label: 'Projects WorkedOn' },
                  { id: 'contractedHours', label: 'Contracted Hours' },
                  { id: 'totalOvertimeHours', label: 'Total Overtime Hours' },
                  { id: 'totalUnderTimeHours', label: 'Total UnderTime Hours' },
                  { id: 'totalWorkedHours', label: 'Total Worked Hours' },
                  { id: 'totalEarnings', label: 'Total Earnings' },
                  { id: 'totalDeductions', label: 'Total Deductions' },
                  { id: 'netSalary', label: 'Net Salary' },
                  { id: 'month', label: 'Month' },
                  { id: 'year', label: 'Year' },
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
                        <EarningTableRow
                          key={row._id}
                          member={row?.member?.name ?? 'N/A'}
                          department={row?.department?.name ?? 'N/A'}
                          currentSalary={row?.currentSalary ? `${row?.currentSalary}$` : 'N/A'}
                          projectsAssigned={
                            row?.projectsAssigned && row?.projectsAssigned.length > 0
                              ? row?.projectsAssigned?.map((project) => project?.name).join(', ')
                              : 'N/A'
                          }
                          projectsWorkedOn={
                            row?.projectsWorkedOn && row?.projectsWorkedOn.length > 0
                              ? row.projectsWorkedOn.map((project, index) => (
                                  <span key={project._id}>
                                    {project.name}
                                    {index < row.projectsWorkedOn.length - 1 ? ', ' : ''}
                                  </span>
                                ))
                              : 'N/A'
                          }
                          contractedHours={row?.contractedHours}
                          totalOvertimeHours={row?.totalOvertimeHours}
                          totalUnderTimeHours={row?.totalUnderTimeHours}
                          totalWorkedHours={row?.totalWorkedHours}
                          totalEarnings={row?.totalEarnings}
                          totalDeductions={row?.totalDeductions}
                          netSalary={row?.netSalary ? `${row?.netSalary}$` : 'N/A'}
                          month={row?.month}
                          year={row?.year}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          handleClickDelete={() => handleClickDelete(row._id)}
                          handleClickUpdate={() =>
                            handleClickUpdate(row._id, {
                              member: row?.member?._id,
                              department: row?.department?._id,
                              totalOvertimeHours: row?.totalOvertimeHours,
                              totalUnderTimeHours: row?.totalUnderTimeHours,
                              projectsWorkedOn: row?.projectsWorkedOn?.map((resource) => ({
                                label: resource?.name,
                                value: resource?._id,
                              })),
                              totalDeductions: row?.totalDeductions,
                            })
                          }
                        />
                      ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, earnings.length)}
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
          count={earnings.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
