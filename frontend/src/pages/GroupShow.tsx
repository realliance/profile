import { useLoaderData } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { Group, joinGroup, leaveGroup } from '../util/api';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function GroupShow() {
  const { token, profile } = useContext(AuthContext);
  const group = useLoaderData() as Group;
  const [joinOverride, setJoinOverride] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const loggedIn = token !== undefined;

  const joined = useMemo(
    () => joinOverride === undefined ? group?.users?.some((user) => user.id === profile?.id) : joinOverride,
    [group, profile, joinOverride],
  );

  const joinLabel = joined ? "Leave Group" : loggedIn ? "Join Group" : "Login to Join Group";

  const handleJoinClick = async () => {
    if (token) {
      setLoading(true);
      if (!joined) {
        await joinGroup(token, group.id);
        setJoinOverride(true);
      } else {
        await leaveGroup(token, group.id);
        setJoinOverride(false);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto flex flex-col gap-3">
      <h1 className="text-4xl font-bold">{group?.name}</h1>
      <Button disabled={!loggedIn} onClick={handleJoinClick} outline className="flex flex-row gap-2 items-center">
        {loading && <Spinner />}
        {joinLabel}
      </Button>
    </div>
  );
}
