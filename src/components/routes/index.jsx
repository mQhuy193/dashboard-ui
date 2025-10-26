import Dashboard from '@/components/pages/Dashboard';
import PostsManage from '@/components/pages/PostsManage';
import RoomDetail from '@/components/pages/RoomDetail';

const publicRoutes = [
    { path: '/', component: Dashboard },
    { path: '/postsmanage', component: PostsManage },
    { path: '/room/:id', component: RoomDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
