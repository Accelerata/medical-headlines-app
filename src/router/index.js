import{createBrowserRouter} from 'react-router-dom';
import Homepage from '@/pages/homepage';
import Login from '@/pages/login';
import Layout from '@/pages/layout';
// import Myself from '@/pages/myself';
// import Publish from '@/pages/publish';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Homepage />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
]);

export default router;