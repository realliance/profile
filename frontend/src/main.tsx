import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './pages/App';
import { AuthContextProvider } from './contexts/AuthContext';
import { loader as profileLoader } from './util/user';
import { GroupList } from './pages/GroupList';
import { loadAllGroups, loadGroup } from './util/group';
import { GroupNew } from './pages/GroupNew';
import { GroupShow } from './pages/GroupShow';
import { Error } from './pages/Error';
import { UserUpdate } from './pages/UserUpdate';
import { ProfilePage } from './pages/Profile';
import { MinecraftConnection } from './pages/MinecraftConnection';
import { MinecraftContextProvider } from './contexts/MinecraftContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
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
      {
        path: 'user/:username/edit',
        element: <UserUpdate />,
        loader: profileLoader,
      },
      {
        path: 'minecraft',
        element: <MinecraftConnection />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <MinecraftContextProvider>
        <RouterProvider router={router} />
      </MinecraftContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
