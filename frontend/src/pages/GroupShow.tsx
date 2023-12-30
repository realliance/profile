import { useLoaderData } from 'react-router-dom';
import { Group } from '../util/group';

export function GroupShow() {
  const group = useLoaderData() as Group;

  return (
    <div className="container max-w-xl mx-auto flex flex-col gap-3">
      <h1 className="text-4xl font-bold">{group.name}</h1>
    </div>
  );
}
