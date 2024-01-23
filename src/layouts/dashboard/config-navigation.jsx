import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'members',
    path: '/members',
    icon: icon('ic_user'),
  },
  {
    title: 'Departments',
    path: '/departments',
    icon: icon('ic_user'),
  },
  {
    title: 'Teams',
    path: '/teams',
    icon: icon('ic_user'),
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: icon('ic_user'),
  },
  {
    title: 'Leads',
    path: '/leads',
    icon: icon('ic_user'),
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: icon('ic_user'),
  },
  {
    title: 'Task',
    path: '/task',
    icon: icon('ic_user'),
  },
  {
    title: 'PayRoll',
    path: '/payroll',
    icon: icon('ic_user'),
  },
  {
    title: 'Earning',
    path: '/earning',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
