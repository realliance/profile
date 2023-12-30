import { useLoaderData } from 'react-router-dom';
import { User } from '../util/user';
import { Card } from 'flowbite-react';

export function ProfilePage() {
  const profile = useLoaderData() as User;

  return (
    <div className="container mx-auto flex flex-col gap-3">
      <h1 className="text-6xl font-bold">{profile.displayName}</h1>
      <h2 className="text-2xl italic">user/{profile.username}</h2>
      <Card>{profile.description ?? 'No description'}</Card>
    </div>
  );
}
