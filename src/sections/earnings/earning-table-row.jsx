// /* eslint-disable */
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function EarningTableRow({
  selected,
  member,
  department,
  currentSalary,
  projectsAssigned,
  projectsWorkedOn,
  contractedHours,
  totalOvertimeHours,
  totalUnderTimeHours,
  totalWorkedHours,
  totalEarnings,
  totalDeductions,
  netSalary,
  month,
  year,
  handleClick,
  handleClickDelete,
  handleClickUpdate,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {member}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{department}</TableCell>
        <TableCell>{currentSalary}</TableCell>
        <TableCell>{projectsAssigned}</TableCell>
        <TableCell>{projectsWorkedOn}</TableCell>
        <TableCell>{contractedHours}</TableCell>
        <TableCell>{totalOvertimeHours}</TableCell>
        <TableCell>{totalUnderTimeHours}</TableCell>
        <TableCell>{totalWorkedHours}</TableCell>
        <TableCell>{totalEarnings}</TableCell>
        <TableCell>{totalDeductions}</TableCell>
        <TableCell>{netSalary}</TableCell>
        <TableCell>{month}</TableCell>
        <TableCell>{year}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleClickUpdate}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleClickDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

EarningTableRow.propTypes = {
  // avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  handleClickUpdate: PropTypes.func,
  handleClickDelete: PropTypes.func,
  member: PropTypes.any,
  department: PropTypes.any,
  currentSalary: PropTypes.any,
  projectsAssigned: PropTypes.any,
  projectsWorkedOn: PropTypes.any,
  contractedHours: PropTypes.any,
  totalOvertimeHours: PropTypes.any,
  totalUnderTimeHours: PropTypes.any,
  totalWorkedHours: PropTypes.any,
  totalEarnings: PropTypes.any,
  totalDeductions: PropTypes.any,
  netSalary: PropTypes.any,
  month: PropTypes.any,
  year: PropTypes.any,
  selected: PropTypes.any,
};
