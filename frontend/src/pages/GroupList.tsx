import { useLoaderData } from 'react-router-dom';
import { Group } from '../util/group';
import { useMemo } from 'react';

export function GroupList() {
  //const { token } = useContext(AuthContext);
  const groups = useLoaderData() as Group[];

  const groupContent = useMemo(
    () => groups.map((group) => <div>{group.name}</div>),
    [groups],
  );

  return (
    <div className="container mx-auto flex flex-col gap-3">
      <h1 className="text-4xl font-bold">Available Groups</h1>
      {groupContent.length > 0 ? groupContent : <p>No groups available</p>}
    </div>
  );
}
