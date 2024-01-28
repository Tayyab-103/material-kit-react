import React from 'react';

import { Box, CircularProgress } from '@mui/material';

const Loader = () => (
  <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        marginLeft: "550px",
        // minHeight: '100vh',
      }}
    >
      <CircularProgress size={80} color="primary" />
    </Box>
  );

export default Loader;
