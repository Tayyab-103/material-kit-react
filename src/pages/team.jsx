import { Helmet } from 'react-helmet-async';

import { TeamView } from 'src/sections/teams/view';


// ----------------------------------------------------------------------

export default function TeamPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Teams Table </title>
      </Helmet>

      <TeamView />
    </>
  );
}
