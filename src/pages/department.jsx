import { Helmet } from 'react-helmet-async';

import { DepartmentView } from 'src/sections/departments/view';


// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Departments Table </title>
      </Helmet>

      <DepartmentView />
    </>
  );
}
