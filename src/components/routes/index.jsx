import Dashboard from '@/components/pages/Dashboard';
import PostsManage from '@/components/pages/PostsManage';

const publicRoutes = [
    { path: '/', component: Dashboard },
    { path: '/postsmanage', component: PostsManage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
