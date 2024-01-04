import { useLoaderData } from 'react-router-dom';
import { Group } from '../util/group';
import { Button } from 'flowbite-react';
import { joinGroup } from '../util/api';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function GroupShow() {
  const { token, profile } = useContext(AuthContext);
  const group = useLoaderData() as Group;

  const joined = useMemo(
    () => group.users.find((user) => user.id === profile?.id) !== undefined,
    [group, profile],
  );

  const join = () => {
    if (token) {
      joinGroup(token, group.id);
    }
  };

  return (
    <div className="container max-w-xl mx-auto flex flex-col gap-3">
      <h1 className="text-4xl font-bold">{group.name}</h1>
      <Button disabled={joined} onClick={join} outline>
        Join
      </Button>
    </div>
  );
}
