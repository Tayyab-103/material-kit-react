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

export default function TaskTableRow({
  selected,
  name,
  lead,
  client,
  salesMember,
  taskStartDate,
  taskEndDate,
  isCompleted,
  taskSupervisor,
  taskDiscription,
  taskSideNote,
  taskLink1,
  taskLink2,
  taskLink3,
  taskTechResources,
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

          <TableCell>{lead}</TableCell>

          <TableCell>{client}</TableCell>
          <TableCell>{salesMember}</TableCell>
          {/* <TableCell>{taskStartDate}</TableCell> */}
          <TableCell component="th" scope="row">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle3" noWrap>
                {taskStartDate}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell component="th" scope="row">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle3" noWrap>
                {taskEndDate}
              </Typography>
            </Stack>
          </TableCell>
          {/* <TableCell>{taskEndDate}</TableCell> */}
          <TableCell>
          <Label color={(isCompleted === 'False' && 'error') || 'success'}>{isCompleted}</Label>
        </TableCell>
          <TableCell>{taskSupervisor}</TableCell>
          <TableCell>{taskDiscription}</TableCell>
          <TableCell>{taskSideNote}</TableCell>
          <TableCell>{taskLink1}</TableCell>
          <TableCell>{taskLink2}</TableCell>
          <TableCell>{taskLink3}</TableCell>
          <TableCell>{taskTechResources}</TableCell>
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

TaskTableRow.propTypes = {
  // avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  handleClickUpdate: PropTypes.func,
  handleClickDelete: PropTypes.func,
  name: PropTypes.any,
  lead: PropTypes.any,
  client: PropTypes.any,
  salesMember: PropTypes.string,
  taskStartDate: PropTypes.any,
  taskEndDate: PropTypes.any,
  isCompleted: PropTypes.any,
  taskSupervisor: PropTypes.any,
  taskDiscription: PropTypes.any,
  taskSideNote: PropTypes.any,
  taskLink1: PropTypes.any,
  taskLink2: PropTypes.any,
  taskLink3: PropTypes.any,
  taskTechResources: PropTypes.string,
  selected: PropTypes.any,
};
