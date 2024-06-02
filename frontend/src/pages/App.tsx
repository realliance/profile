import { Badge, DarkThemeToggle, Footer, Navbar } from 'flowbite-react';
import { ReallianceProvider, useOIDCProvider } from '../util/oidc';
import { useContext, useEffect, useMemo } from 'react';
import { Link, Outlet, useNavigation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function App() {
  const { profile, loading, updateToken, updateRefreshToken, needRefresh, refreshToken } = useContext(AuthContext);
  const { beginFlow, completeFlow, refreshToken: beginRefreshToken } = useOIDCProvider({ ...ReallianceProvider, redirectUriPath: window.location.pathname });

  const navigation = useNavigation();

  useEffect(() =>{
    if (!loading && needRefresh && refreshToken) {
      beginRefreshToken(refreshToken, updateToken, updateRefreshToken)
    }
  }, [updateToken, updateRefreshToken, beginRefreshToken, needRefresh, refreshToken])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code') !== null) {
      completeFlow(updateToken, updateRefreshToken);
    }
  }, []);

  const profileItem = useMemo(() => {
    if (loading) {
      return (
        <div className="w-32 h-6 mt-1 animate-pulse dark:bg-gray-600 bg-zinc-100 rounded" />
      );
    } else if (profile) {
      return (
        <Navbar.Link
          as={Link}
          to={`/user/${profile.username}`}
          className="flex flex-row gap-2 self-center"
        >
          {profile.displayName}{' '}
          {profile.admin && <Badge color="info">Admin</Badge>}
        </Navbar.Link>
      );
    } else {
      return (
        <Navbar.Link onClick={() => beginFlow()}>
          Login
        </Navbar.Link>
      );
    }
  }, [profile, loading, beginFlow]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        fluid
        className="px-6 border border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700 mb-3"
      >
        <Navbar.Brand as={Link} href="/">
          <img
            src="/reABackground.png"
            className="mr-3 h-6 sm:h-9 rounded"
            alt="Realliance Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white mr-3">
            Realliance Community
          </span>
          <Badge color="info">Under Construction</Badge>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>{profileItem}</Navbar.Collapse>
      </Navbar>
      <div
        className={`mx-3 mt-3 grow ${
          navigation.state === 'loading' ? 'animate-pulse' : ''
        }`}
      >
        <Outlet />
      </div>
      <Footer container>
        <Footer.LinkGroup>
          <Footer.Link href="#">
            <DarkThemeToggle />
          </Footer.Link>
        </Footer.LinkGroup>
      </Footer>
    </div>
  );
}

export default App;
