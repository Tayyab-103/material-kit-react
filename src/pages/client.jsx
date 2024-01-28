import { Helmet } from 'react-helmet-async';

import { ClientView } from 'src/sections/clients/view';


// ----------------------------------------------------------------------

export default function ClientPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Clients Table </title>
      </Helmet>

      <ClientView />
    </>
  );
}
