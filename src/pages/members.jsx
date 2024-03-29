import { Helmet } from 'react-helmet-async';

import { MembersView } from 'src/sections/members/view';


// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Members Table </title>
      </Helmet>

      <MembersView />
    </>
  );
}
