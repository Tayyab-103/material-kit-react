/* eslint-disable */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { getMembers } from 'src/store/thunk/member.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import MemberTableHead from '../member-table-head';
import MemberTableRow from '../member-table-row';
import MemberTableToolbar from '../member-table-toolbar';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';


// ----------------------------------------------------------------------

export default function MemberPage() {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.members?.data);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dataFiltered, setDataFiltered] = useState([]);

  useEffect(() => {
    // setIsLoading(true);
    dispatch(getMembers())
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
      const newSelecteds = members && members?.map((n) => n.name);
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
      inputData: members,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    setDataFiltered(filteredData);
  }, [members, order, orderBy, filterName]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Members</Typography>

        <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />}>
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
                rowCount={members?.length}
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
                  
                ]}
              />
              <TableBody >
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
                        emergencyContactName={row?.emergencyContactName ?? "N/A"}
                        emergencyContactNumber={row?.emergencyContactNumber ?? "N/A"}
                        emergencyContactRelation={row?.emergencyContactRelation ?? "N/A"}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                      />
                    ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, members.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={members.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
