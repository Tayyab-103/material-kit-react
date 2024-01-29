/* eslint-disable import/named */
import { Helmet } from 'react-helmet-async';

import { PasswordResetView } from 'src/sections/reset_Password/view';


// ----------------------------------------------------------------------

export default function PasswordResetPage() {
  return (
    <>
      <Helmet>
        <title>TDC | RestPassword </title>
      </Helmet>

      <PasswordResetView />
    </>
  );
}
