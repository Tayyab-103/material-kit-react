import { Helmet } from 'react-helmet-async';

import { LeadView } from 'src/sections/leads/view';


// ----------------------------------------------------------------------

export default function LeadPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Leads Table </title>
      </Helmet>

      <LeadView />
    </>
  );
}
