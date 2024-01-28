/* eslint-disable */
import PropTypes from 'prop-types';
import { useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function LeadTableRow({
  selected,
  name,
  date,
  salesTeamMember,
  client,
  appointment,
  leadStatus,
  linkJobApplied,
  jobDescription,
  sentDescription,
  call,
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

          <TableCell component="th" scope="row"sx={{ padding: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* <Avatar alt={name} src={avatarUrl} /> */}
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </Stack>
          </TableCell>

          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* <Avatar alt={name} src={avatarUrl} /> */}
              <Typography variant="subtitle3" noWrap>
                {date}
              </Typography>
            </Stack>
          </TableCell>

          {/* <TableCell>{date}</TableCell> */}

          <TableCell>{salesTeamMember}</TableCell>
          <TableCell>{client}</TableCell>
          <TableCell>{appointment}</TableCell>

          <TableCell>
            <Label
              color={leadStatus === 'HOT' ? 'error' : leadStatus === 'COLD' ? 'info' : 'success'}
            >
              {leadStatus}
            </Label>
          </TableCell>
          {/* <TableCell>{leadStatus}</TableCell> */}
          <TableCell>{linkJobApplied}</TableCell>
          <TableCell>{jobDescription}</TableCell>
          <TableCell>{sentDescription}</TableCell>
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* <Avatar alt={name} src={avatarUrl} /> */}
              <Typography variant="subtitle3" noWrap>
                {call}
              </Typography>
            </Stack>
          </TableCell>

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

LeadTableRow.propTypes = {
  // avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  handleClickUpdate: PropTypes.func,
  handleClickDelete: PropTypes.func,
  name: PropTypes.any,
  date: PropTypes.any,
  salesTeamMember: PropTypes.any,
  client: PropTypes.any,
  linkJobApplied: PropTypes.any,
  jobDescription: PropTypes.any,
  sentDescription: PropTypes.any,
  appointment: PropTypes.any,
  call: PropTypes.any,
  leadStatus: PropTypes.any,
  selected: PropTypes.any,
};
