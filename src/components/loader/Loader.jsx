import React from 'react';

import { CircularProgress } from '@mui/material';

const Loader = () => (
  <div
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
    </div>
  );

export default Loader;
