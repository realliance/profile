import { createContext, useEffect, useState } from 'react';
import { ContextProps } from './AuthContext';

export interface MinecraftContext {
  loading: boolean;
  id?: string;
  username?: string;
  avatar?: string;
  provideID: (id: string) => void;
}

export const MinecraftContext = createContext<MinecraftContext>({
  loading: true,
  provideID: () => {},
});

export function MinecraftContextProvider({ children }: ContextProps) {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id !== undefined && username === undefined && !loading) {
      const run = async () => {
        const userInfo = await fetch(
          `https://playerdb.co/api/player/minecraft/${id}`,
          {
            headers: {
              'User-Agent': 'community.realliance.net',
              Accept: 'application/json',
            },
          },
        );

        const userJson = await userInfo.json();
        setUsername(userJson.data.player.username ?? 'n/a');
        setAvatar(userJson.data.player.avatar);
        setLoading(false);
      };

      run();
      setLoading(true);
    }
  }, [id, loading, username]);

  const context: MinecraftContext = {
    loading,
    id,
    username,
    avatar,
    provideID: (id) => {
      if (id) {
        console.log('New id provided');
        setId(id);
        setUsername(undefined);
        setAvatar(undefined);
      }
    },
  };

  return (
    <MinecraftContext.Provider value={context}>
      {children}
    </MinecraftContext.Provider>
  );
}
