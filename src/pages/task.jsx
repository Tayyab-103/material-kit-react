import { Helmet } from 'react-helmet-async';

import { TaskView } from 'src/sections/tasks/view';


// ----------------------------------------------------------------------

export default function TaskPage() {
  return (
    <>
      <Helmet>
        <title>TDC | Task Table </title>
      </Helmet>

      <TaskView />
    </>
  );
}
