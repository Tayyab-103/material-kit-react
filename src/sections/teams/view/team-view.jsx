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

// import { users } from 'src/_mock/user';
import { addTeam, editTeam, getTeams, deleteTeam } from 'src/store/thunk/team.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TeamModal from './TeamModal';
import TableNoData from '../table-no-data';
import TeamTableRow from '../team-table-row';
import TeamTableHead from '../team-table-head';
import TableEmptyRows from '../table-empty-rows';
import TeamTableToolbar from '../team-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function TeamPage() {
  const dispatch = useDispatch();
  const teamData = useSelector((state) => state.teams?.data);
  // console.log(teamData, 'helloooo=====');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataFiltered, setDataFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [teams, setTeams] = useState(teamData);
  const [teamEditData, setTeamEditData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState('');

  const handleModalClick = () => {
    setTeamEditData(null);
    setIsModalOpen(true);
  };

  const handleClickDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleSaveTeam = (teamData) => {
    dispatch(addTeam({ teamData }))
      .then((res) => {
        dispatch(getTeams())
          .then((res) => {
            setTeams(res.payload);
            toast.success('Team Added Succesfully');
          })
          .catch((err) => {
            toast.error('Error while getting updated Team');
          });
      })
      .catch((err) => {
        toast.error('Error while adding Team');
      });
  };

  const handleConfirmDelete = () => {
    handleCancelDelete();
    dispatch(deleteTeam(deleteId)).then((res) => {
      dispatch(getTeams()).then((res) => {
        setTeams(res.payload);
        toast.success('Team Deleted Succesfully');
      });
    });
  };

  const triggerEditTeam = (rowData) => {
    setTeamEditData(rowData);
    // setIndexOfRow(index);
    setIsModalOpen(true);
  };

  const handleEditTeam = (teamData) => {
    dispatch(editTeam(teamData)).then((res) => {
      dispatch(getTeams()).then((res) => {
        setTeams(res.payload);
        toast.success('Team Edited Succesfully');
      });
    });
  };

  const handleBack = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // setIsLoading(true);
    dispatch(getTeams());
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
      const newSelecteds = teamData.map((n) => n.name);
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
      inputData: teamData,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    setDataFiltered(filteredData);
  }, [teamData, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
       <TeamModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onBack={handleBack}
         teams={teams}
        onSave={handleSaveTeam}
        editData={teamEditData}
        edit={handleEditTeam}
      />
      <Dialog open={isDeleteConfirmationOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this team?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Teams</Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleModalClick}
        >
          New Team
        </Button>
      </Stack>

      <Card>
        <TeamTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TeamTableHead
                order={order}
                orderBy={orderBy}
                rowCount={teamData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'technology', label: 'Technology' },
                  { id: 'department', label: 'Department' },
                  { id: 'team_head', label: 'Team_Head' },
                  { id: 'members', label: 'Members' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'actions', label: 'Actions', align:'right'},
                ]}
              />
              <TableBody>
                {dataFiltered &&
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TeamTableRow
                        key={row._id}
                        name={row.name}
                        technology={row?.technology}
                        department={row.department ? row.department.name : 'N/A'}
                        team_head={row.team_head ? row.team_head.name : 'N/A'}
                        members={
                          row.members && row.members.length > 0
                            ? row.members?.map((member) => member.name).join(', ')
                            : 'N/A'
                        }
                        projects={
                          row.projects && row.projects.length > 0
                            ? row.projects?.map((project) => project.name).join(', ')
                            : 'N/A'
                        }
                        // avatarUrl={row.avatarUrl}
                        // isVerified={row.isVerified}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleClickUpdate={() => triggerEditTeam(row)}
                        handleClickDelete={() => handleClickDelete(row._id)}
                      />
                    ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, teamData?.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={teamData?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
