import { ReactNode, createContext, useEffect, useState } from "react";
import { profile as getProfile } from "../util/api";
import { useCookies } from 'react-cookie';
import { decodeJwt, JWTPayload } from 'jose'
import { Profile } from "../util/profile";

const MIN_WAIT_MS = 500;

export interface AuthedContext {
    loading: boolean;
    token?: string;
    profile?: Profile;
    reloadAuthState: () => void;
    updateToken: (token: string) => void;
}

interface AuthContextProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthedContext>({
    loading: true,
    reloadAuthState: () => {},
    updateToken: () => {},
});

export function AuthContextProvider({ children }: AuthContextProps) {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile | undefined>(undefined);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    // Token-Cookie Sync
    useEffect(() => {
        // Token is not defined yet, but is in cache and exp is not too late
        if (cookies.token && !token) {
            try {
                const res = decodeJwt(cookies.token) as JWTPayload;
                if (res && (res.exp ?? 0) >= Date.now() / 1000) {
                    console.log("Setting token")
                    setToken(cookies.token);
                    setLoading(true);
                    return;
                } else {
                    console.log("Removing cookie, expired");
                    removeCookie("token");
                }
            } catch (e) {
                console.warn('Failure while syncing token and cookies', e);
                removeCookie("token");
            }
        // A load attempted, and no token, make sure no cookie
        } else if (!loading && !token && cookies.token) {
            console.log("Clearing Cookie")
            removeCookie("token");
        
        } else if (!loading && token && !cookies.token) {
            console.log("Updated token");
            setCookie("token", token, {
                sameSite: "strict"
            });
        }
    }, [cookies, removeCookie, setCookie, setLoading, loading, token]);

    useEffect(() => {
        if (loading && token && !profile) {
            console.log("Getting profile claims")
            const run = async () => {
                const now = Date.now();
                const res = await getProfile(token);

                const json = await res.json();
                const diff = Date.now() - now;
                const minWait = MIN_WAIT_MS - diff;
                const wait = Math.max(0, minWait);

                setTimeout(() => {
                    setProfile(json);
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
        }
    }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}