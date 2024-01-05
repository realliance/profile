import { Link, useLoaderData } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import { AuthContext } from '../contexts/AuthContext';
import { Card } from 'flowbite-react';
import { Group } from '../util/api';

export function GroupList() {
  const { profile } = useContext(AuthContext);
  const admin = profile?.admin;
  const groups = useLoaderData() as Group[];

  const groupContent = useMemo(
    () =>
      groups.map((group) => (
        <Card key={group.id} href={`/group/${group.id}`}>
          {group.name}
        </Card>
      )),
    [groups],
  );

  return (
    <div className="container mx-auto flex flex-col gap-3">
      <h1 className="text-4xl font-bold flex flex-row gap-2">
        <span>Available Groups</span>
        {admin && (
          <Link to="group/new">
            <HiMiniPlus className="w-8" />
          </Link>
        )}
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {groupContent.length > 0 ? groupContent : <p>No groups available</p>}
      </div>
    </div>
  );
}
