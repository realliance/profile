import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ProfilePage } from './pages/Profile';
import App from './pages/App';
import { AuthContextProvider } from './contexts/AuthContext';
import { loader as profileLoader } from './util/user';
import { GroupList } from './pages/GroupList';
import { loadAllGroups, loadGroup } from './util/group';
import { GroupNew } from './pages/GroupNew';
import { GroupShow } from './pages/GroupShow';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not found</div>,
    children: [
      {
        path: '/',
        element: <GroupList />,
        loader: loadAllGroups,
      },
      {
        path: 'group/new',
        element: <GroupNew />,
      },
      {
        path: 'group/:id',
        element: <GroupShow />,
        loader: loadGroup,
      },
      {
        path: 'user/:username',
        element: <ProfilePage />,
        loader: profileLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
);
