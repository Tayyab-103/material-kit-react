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


// ----------------------------------------------------------------------

export default function ClientTableRow({
  selected,
  name,
  email,
  contactNumber,
  platform,
  regionLocated,
  isActive,
  isOnBoarded,
  emailSecondary,
  dateContacted,
  contactPlatformLink1,
  contactPlatformLink2,
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

        <TableCell component="th" scope="row" sx={{ padding: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{contactNumber}</TableCell>
        <TableCell>{platform}</TableCell>
        <TableCell>{regionLocated}</TableCell>
        <TableCell>{isActive}</TableCell>
        <TableCell>{isOnBoarded}</TableCell>
        <TableCell>{emailSecondary}</TableCell>
        <TableCell>{dateContacted}</TableCell>
        <TableCell>{contactPlatformLink1}</TableCell>
        <TableCell>{contactPlatformLink2}</TableCell>

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

ClientTableRow.propTypes = {
  // avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  handleClickUpdate: PropTypes.func,
  handleClickDelete: PropTypes.func,
  name: PropTypes.any,
  email: PropTypes.any,
  contactNumber: PropTypes.any,
  platform: PropTypes.any,
  regionLocated: PropTypes.any,
  isActive: PropTypes.any,
  isOnBoarded: PropTypes.any,
  emailSecondary: PropTypes.any,
  dateContacted: PropTypes.any,
  contactPlatformLink1: PropTypes.any,
  contactPlatformLink2: PropTypes.any,
  selected: PropTypes.any,
};
