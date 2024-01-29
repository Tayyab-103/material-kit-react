import { Helmet } from 'react-helmet-async';

import { PayrollView } from 'src/sections/payrolls/view';


// ----------------------------------------------------------------------

export default function PayrollPage() {
  return (
    <>
      <Helmet>
        <title>TDC | PayRoll Table </title>
      </Helmet>

      <PayrollView />
    </>
  );
}
