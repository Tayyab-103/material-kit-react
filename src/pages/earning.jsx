import { Helmet } from 'react-helmet-async';

import { EarningView } from 'src/sections/earnings/view';


// ----------------------------------------------------------------------

export default function EarningPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Earning Table </title>
      </Helmet>

      <EarningView />
    </>
  );
}
