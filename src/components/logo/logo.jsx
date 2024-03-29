/* eslint-disable */
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;
  // const PRIMARY_MAIN = theme.palette.primary.main;
  // const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      ref={ref}
      component="p"
      sx={{
        width: 150,
        height: 150,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {/* Your logo SVG or image here */}
      <img
        src="https://github.com/Tayyab-103/JavaScript-103/assets/109760448/2121afa4-8a0b-4b17-81b2-761e425fc7d2"
        alt="Logo"
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
    {logo}
  </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
