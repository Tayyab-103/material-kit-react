/* eslint-disable */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { getDepartments } from 'src/store/thunk/department.thunk';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import DepartmentTableHead from '../department-table-head';
import DepartmentTableRow from '../department-table-row';
import DepartmentTableToolbar from '../department-table-toolbar';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

// ----------------------------------------------------------------------

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

  useEffect(() => {
    // setIsLoading(true);
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
    // console.log(filteredData," Helooo====a=ascsac===")
    setDataFiltered(filteredData);
  }, [departments, order, orderBy, filterName]);

  
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Departments </Typography>

        <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />}>
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
