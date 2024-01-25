/* eslint-disable */
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProjectTableRow({
  selected,
  name,
  team_lead,
  teams_assigned,
  members_assigned,
  client,
  status,
  start_date,
  end_date,
  tech_stack,
  platform,
  contract_type,
  duration,
  duration_unit,
  cost,
  hourly_cost,
  // avatarUrl,
  // company,
  // role,
  // isVerified,
  handleClick,
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
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{team_lead}</TableCell>

        <TableCell>{teams_assigned}</TableCell>
        <TableCell>{members_assigned}</TableCell>
        <TableCell>{client}</TableCell>
        {/* <TableCell>{status}</TableCell> */}
        <TableCell>
          <Label color={(status === 'on-going' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell>{start_date}</TableCell>
        <TableCell>{end_date}</TableCell>
        <TableCell>{tech_stack}</TableCell>
        <TableCell>{platform}</TableCell>
        <TableCell>{contract_type}</TableCell>
        <TableCell>{duration}</TableCell>
        <TableCell>{duration_unit}</TableCell>
        <TableCell>{cost}</TableCell>
        <TableCell>{hourly_cost}</TableCell>

        {/* <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell> */}


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
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

ProjectTableRow.propTypes = {
  // avatarUrl: PropTypes.any,
  name: PropTypes.any,
  team_lead: PropTypes.any,
  teams_assigned: PropTypes.any,
  members_assigned: PropTypes.any,
  client: PropTypes.any,
  status: PropTypes.any,
  start_date: PropTypes.any,
  end_date: PropTypes.any,
  tech_stack: PropTypes.any,
  platform: PropTypes.any,
  contract_type: PropTypes.any,
  duration: PropTypes.any,
  duration_unit: PropTypes.any,
  cost: PropTypes.any,
  hourly_cost: PropTypes.any,
  handleClick: PropTypes.func,
  // isVerified: PropTypes.any,
  // role: PropTypes.any,
  selected: PropTypes.any,
};
