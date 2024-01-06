import { useContext, useEffect, useState } from 'react';
import { MicrosoftProvider, useOIDCProvider } from '../util/oidc';
import { AuthContext } from '../contexts/AuthContext';
import { addMinecraftToUser } from '../util/api';

export function MinecraftConnection() {
  const { token } = useContext(AuthContext);
  const [msAccessToken, setMsAccessToken] = useState<string | undefined>(
    undefined,
  );
  const { completeFlow } = useOIDCProvider(MicrosoftProvider);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code') !== null) {
      completeFlow(setMsAccessToken);
    }
  }, []);

  useEffect(() => {
    if (token && msAccessToken) {
      addMinecraftToUser(token, msAccessToken);
    }
  }, [msAccessToken, token]);

  const text = msAccessToken
    ? 'Connecting To Minecraft Servers...'
    : 'Finishing Authentication Flow...';

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h1 className="text-lg">{text}</h1>
      </div>
    </div>
  );
}
