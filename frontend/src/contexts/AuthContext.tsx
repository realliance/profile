import { ReactNode, createContext, useEffect, useState } from 'react';
import { User, profile as getProfile } from '../util/api';
import { useCookies } from 'react-cookie';
import { decodeJwt, JWTPayload } from 'jose';
import Cookies from 'js-cookie';

const MIN_WAIT_MS = 200;

export interface AuthedContext {
  loading: boolean;
  token?: string;
  refreshToken?: string;
  profile?: User;
  needRefresh: boolean;
  reloadAuthState: () => void;
  updateToken: (token: string) => void;
  updateRefreshToken: (refreshToken: string | undefined) => void;
}

export interface ContextProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthedContext>({
  loading: true,
  needRefresh: false,
  reloadAuthState: () => {},
  updateToken: () => {},
  updateRefreshToken: () => {},
});

export function AuthContextProvider({ children }: ContextProps) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<User | undefined>(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'refreshToken']);
  const [needRefresh, setNeedRefresh] = useState(false);

  // Token-Cookie Sync
  useEffect(() => {
    // Token is not defined yet, but is in cache and exp is not too late
    if (cookies.token && !token) {
      try { 
        const res = decodeJwt(cookies.token) as JWTPayload;
        if (res && (res.exp ?? 0) >= Date.now() / 1000) {
          console.log('Setting token');
          setToken(cookies.token);
          setRefreshToken(cookies.refreshToken);
          setNeedRefresh(false);
          setLoading(true);
          return;
        } else {
          console.log('Removing cookie, expired');
          Cookies.remove('token');
          removeCookie('token');

          if (refreshToken) {
            setNeedRefresh(true);
          }
        }
      } catch (e) {
        console.warn('Failure while syncing token and cookies', e);
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        removeCookie('token');
        removeCookie('refreshToken');
        setNeedRefresh(false);
      }
    } else if (!loading && token && !cookies.token) {
      console.log('Updated token');
      setCookie('token', token, {
        sameSite: 'strict',
      });

      if (refreshToken) {
        setCookie('refreshToken', refreshToken, {
          sameSite: 'strict',
        });
        setNeedRefresh(false);
      }
    } else if (!cookies.token && cookies.refreshToken) {
      setRefreshToken(cookies.refreshToken);
      setNeedRefresh(true);
    }
  }, [cookies, removeCookie, setCookie, setLoading, loading, token]);

  useEffect(() => {
    if (loading && token && !profile) {
      console.log('Getting profile claims');
      const run = async () => {
        const now = Date.now();
        const resp = await getProfile(token);
        const error = resp.error;
        let data = resp.data;

        if (error) {
          console.error(error);
          return;
        }

        // On first load data can sometimes not exist, double check
        if (data?.id === undefined) {
          data = (await getProfile(token)).data;
        }

        const diff = Date.now() - now;
        const minWait = MIN_WAIT_MS - diff;
        const wait = Math.max(0, minWait);

        setTimeout(() => {
          setProfile(data);
          setLoading(false);
        }, wait);
      };

      run();
    } else if (loading && !token) {
      setLoading(false);
    }
  }, [loading, profile, token]);

  const context: AuthedContext = {
    profile,
    token,
    needRefresh,
    refreshToken,
    loading,
    reloadAuthState: () => {
      setLoading(true);
      setProfile(undefined);
    },
    updateToken: (token) => {
      setLoading(true);
      setToken(token);
    },
    updateRefreshToken: (refreshToken) => {
      setRefreshToken(refreshToken);
    },
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
