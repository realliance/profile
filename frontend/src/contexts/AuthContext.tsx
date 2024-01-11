import { ReactNode, createContext, useEffect, useState } from 'react';
import { User, profile as getProfile } from '../util/api';
import { useCookies } from 'react-cookie';
import { decodeJwt, JWTPayload } from 'jose';

const MIN_WAIT_MS = 200;

export interface AuthedContext {
  loading: boolean;
  token?: string;
  profile?: User;
  reloadAuthState: () => void;
  updateToken: (token: string) => void;
}

export interface ContextProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthedContext>({
  loading: true,
  reloadAuthState: () => {},
  updateToken: () => {},
});

export function AuthContextProvider({ children }: ContextProps) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<User | undefined>(undefined);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // Token-Cookie Sync
  useEffect(() => {
    // Token is not defined yet, but is in cache and exp is not too late
    if (cookies.token && !token) {
      try {
        const res = decodeJwt(cookies.token) as JWTPayload;
        if (res && (res.exp ?? 0) >= Date.now() / 1000) {
          console.log('Setting token');
          setToken(cookies.token);
          setLoading(true);
          return;
        } else {
          console.log('Removing cookie, expired');
          removeCookie('token');
        }
      } catch (e) {
        console.warn('Failure while syncing token and cookies', e);
        removeCookie('token');
      }
    } else if (!loading && token && !cookies.token) {
      console.log('Updated token');
      setCookie('token', token, {
        sameSite: 'strict',
      });
    }
  }, [cookies, removeCookie, setCookie, setLoading, loading, token]);

  useEffect(() => {
    if (loading && token && !profile) {
      console.log('Getting profile claims');
      const run = async () => {
        const now = Date.now();
        const { data, error } = await getProfile(token);

        if (error) {
          console.error(error);
          return;
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
    loading,
    reloadAuthState: () => setLoading(true),
    updateToken: (token) => {
      setLoading(true);
      setToken(token);
    },
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
