import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { addDiscordToUser } from '../util/api';

export function DiscordConnection() {
    const { token, profile } = useContext(AuthContext);
    const [accessToken, setAccessToken] = useState<string | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const fragments = hash.split('&');
        const accessToken = fragments.find((x) => x.includes('access_token='));

        if (accessToken) {
            setAccessToken(accessToken.replace('access_token=', ''));
        }
    }, [setAccessToken]);

    useEffect(() => {
        if (token && accessToken && !loading && !message) {
            setLoading(true);
            const run = async () => {
                try {
                    console.log('Sending', accessToken);
                    const { error } = await addDiscordToUser(token, {
                        token: accessToken,
                    });

                    if (error) {
                        setMessage(JSON.stringify(error));
                        return;
                    }

                    setMessage('Discord Connection Complete');
                    navigate(`/user/${profile?.username}/edit`);
                } catch (e) {
                    setMessage(`An error occured while connecting, ${e}`);
                } finally {
                    setLoading(false);
                }
            };

            run();
        }
    }, [accessToken, token, loading, message, navigate, profile]);

    const text =
        message ??
        (accessToken
            ? 'Connecting To Discord...'
            : 'Finishing Authentication Flow...');

    return (
        <div className="h-screen flex items-center justify-center flex-col gap-2">
            <h1 className="text-lg">{text}</h1>
            {loading && <Spinner />}
        </div>
    );
}
