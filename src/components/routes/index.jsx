import Dashboard from '@/components/pages/Dashboard';
import ContactsManage from '@/components/pages/ContactsManage';
import PostsManage from '@/components/pages/PostsManage';
import Setting from '@/components/pages/Setting';
import UsersManage from '@/components/pages/UsersManage';

const publicRoutes = [
    { path: '/', component: Dashboard },
    { path: '/postsmanage', component: PostsManage },
    { path: '/usersmanage', component: UsersManage },
    { path: '/contactsmanage', component: ContactsManage },
    { path: '/setting', component: Setting },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
