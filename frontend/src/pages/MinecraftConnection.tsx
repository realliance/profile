import { useContext, useEffect, useState } from 'react';
import { MicrosoftProvider, useOIDCProvider } from '../util/oidc';
import { AuthContext } from '../contexts/AuthContext';
import { addMinecraftToUser } from '../util/api';
import { Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export function MinecraftConnection() {
  const { token, profile } = useContext(AuthContext);
  const [msAccessToken, setMsAccessToken] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { completeFlow } = useOIDCProvider(MicrosoftProvider);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('code') !== null) {
      completeFlow(setMsAccessToken, () => {});
    }
  }, [completeFlow]);

  useEffect(() => {
    if (token && msAccessToken && !loading && !message) {
      setLoading(true);
      const run = async () => {
        try {
          console.log('Sending', msAccessToken);
          const { error } = await addMinecraftToUser(token, {
            token: msAccessToken,
          });

          if (error) {
            setMessage(JSON.stringify(error));
            return;
          }

          setMessage('Minecraft Connection Complete');
          navigate(`/user/${profile?.username}/edit`);
        } catch (e) {
          setMessage(`An error occured while connecting, ${e}`);
        } finally {
          setLoading(false);
        }
      };

      run();
    }
  }, [msAccessToken, token, loading, message, navigate, profile]);

  const text =
    message ??
    (msAccessToken
      ? 'Connecting To Minecraft Servers...'
      : 'Finishing Authentication Flow...');

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-2">
      <h1 className="text-lg">{text}</h1>
      {loading && <Spinner />}
    </div>
  );
}
