/* eslint-disable */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getProjects } from 'src/store/thunk/project.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ProjectTableRow from '../project-table-row';
import ProjectTableHead from '../project-table-head';
import TableEmptyRows from '../table-empty-rows';
import ProjectTableToolbar from '../project-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ProjectPage() {
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state.projects?.data);
  // console.log(projectData, "Hello testing=====")
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [dataFiltered, setDataFiltered] = useState([]);

  useEffect(() => {
    // setIsLoading(true);
    dispatch(getProjects());
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
      const newSelecteds = projectData.map((n) => n.name);
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
      inputData: projectData,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    setDataFiltered(filteredData);
  }, [projectData, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;



  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Projects</Typography>

        <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Project
        </Button>
      </Stack>

      <Card>
        <ProjectTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProjectTableHead
                order={order}
                orderBy={orderBy}
                rowCount={projectData?.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'team_lead', label: 'Team_Lead' },
                  { id: 'teams_assigned', label: 'Teams_Assigned' },
                  { id: 'members_assigned', label: 'Members_Assigned', align: 'center' },
                  { id: 'client', label: 'Client' },
                  { id: 'status', label: 'Status' },
                  { id: 'start_date', label: 'Start_Date' },
                  { id: 'end_date', label: 'End_Date' },
                  { id: 'tech_stack', label: 'Tech_Stack' },
                  { id: 'platform', label: 'Platform' },
                  { id: 'contract_type', label: 'Contract_Type' },
                  { id: 'duration', label: 'Duration' },
                  { id: 'duration_unit', label: 'Duration_Unit' },
                  { id: 'cost', label: 'Cost' },
                  { id: 'hourly_cost', label: 'Hourly_Cost' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered && dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ProjectTableRow
                      key={row._id}
                      name={row.name}
                      team_lead={row?.team_lead?.name ?? "N/A"}
                      teams_assigned={row.teams_assigned && row.teams_assigned.length > 0
                        ? row.teams_assigned
                            ?.map((team) => team?.name)
                            .join(", ")
                        : "N/A"}
                        members_assigned={row.members_assigned && row.members_assigned.length > 0
                        ? row.members_assigned
                            ?.map((member) => member?.name)
                            .join(", ")
                        : "N/A"}
                        client={row?.client?.name ?? "N/A"}
                      status={row?.status}
                      start_date={new Date(row.start_date).toLocaleDateString()}
                      end_date={new Date(row.end_date).toLocaleDateString()}
                      sales_coordinator={row?.sales_coordinator?.name ?? "N/A"}
                      tech_stack={row?.tech_stack ?? "N/A"}
                      platform={row?.platform ?? "N/A"}
                      contract_type={row?.contract_type ?? "N/A"}
                      duration={row?.duration ?? "N/A"}
                      duration_unit={row?.duration_unit ?? "N/A"}
                      cost={row?.cost ?? "N/A"}
                      hourly_cost={row?.hourly_cost ?? "N/A"}
                      // avatarUrl={row.avatarUrl}
                      // isVerified={row.isVerified}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, projectData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={projectData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
