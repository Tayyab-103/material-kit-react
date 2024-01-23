import { Helmet } from 'react-helmet-async';

import { MembersView } from 'src/sections/members/view';


// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Members Table </title>
      </Helmet>

      <MembersView />
    </>
  );
}
