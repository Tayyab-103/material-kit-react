// import SvgColor from 'src/components/svg-color';

// // ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

// const navConfig = [
//   {
//     // title: 'dashboard',
//     title: 'Welcome',
//     path: '/',
//     icon: icon('ic_analytics'),
//   },
//   // {
//   //   title: 'user',
//   //   path: '/user',
//   //   icon: icon('ic_user'),
//   // },
//   {
//     title: 'members',
//     path: '/members',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Departments',
//     path: '/departments',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Teams',
//     path: '/teams',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Projects',
//     path: '/projects',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Leads',
//     path: '/leads',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Clients',
//     path: '/clients',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Task',
//     path: '/task',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'PayRoll',
//     path: '/payroll',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'Earning',
//     path: '/earning',
//     icon: icon('ic_user'),
//   },
//   // {
//   //   title: 'product',
//   //   path: '/products',
//   //   icon: icon('ic_cart'),
//   // },
//   // {
//   //   title: 'blog',
//   //   path: '/blog',
//   //   icon: icon('ic_blog'),
//   // },
//   // {
//   //   title: 'login',
//   //   path: '/login',
//   //   icon: icon('ic_lock'),
//   // },
//   // {
//   //   title: 'Not found',
//   //   path: '/404',
//   //   icon: icon('ic_disabled'),
//   // },
// ];

// export default navConfig;



import { 
  Work as WorkIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  BusinessCenter as BusinessCenterIcon,
  MonetizationOn as MonetizationOnIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon
} from '@mui/icons-material';

const navConfig = [
  {
    title: 'Welcome',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    title: 'Members',
    path: '/members',
    icon: <PersonIcon />,
  },
  {
    title: 'Departments',
    path: '/departments',
    icon: <AccountBalanceIcon />,
  },
  {
    title: 'Teams',
    path: '/teams',
    icon: <PeopleIcon />,
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: <WorkIcon />,
  },
  {
    title: 'Leads',
    path: '/leads',
    icon: <BusinessCenterIcon />,
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: <SupervisedUserCircleIcon />,
  },
  {
    title: 'Task',
    path: '/task',
    icon: <AssignmentIcon />,
  },
  {
    title: 'PayRoll',
    path: '/payroll',
    icon: <MonetizationOnIcon />,
  },
  {
    title: 'Earning',
    path: '/earning',
    icon: <MonetizationOnIcon />, 
  },
  // {
  //   title: 'Reset Password',
  //   path: '/forget-password/verify',
  //   icon: <MonetizationOnIcon />, 
  // }
];

export default navConfig;
