import { Helmet } from 'react-helmet-async';

import { ProjectView } from 'src/sections/projects/view';


// ----------------------------------------------------------------------

export default function ProjectPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Projects Table </title>
      </Helmet>

      <ProjectView />
    </>
  );
}
