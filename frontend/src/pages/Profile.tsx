import { Link, useLoaderData } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { User } from '../util/api';
import { useContext, useMemo } from 'react';
import { canEdit } from '../util/user';
import { AuthContext } from '../contexts/AuthContext';

export function ProfilePage() {
  const { profile: contextProfile } = useContext(AuthContext);
  const profile = useLoaderData() as User;

  const edit = useMemo(
    () => canEdit(contextProfile, profile?.username),
    [contextProfile, profile],
  );

  return (
    <div className="container mx-auto max-w-4xl flex flex-col gap-3">
      <h1 className="text-6xl font-bold flex flex-row gap-2">
        <span>{profile.displayName}</span>
        <span className="italic text-xl">
          {profile.pronouns ? `(${profile.pronouns})` : null}
        </span>
      </h1>
      <h2 className="text-2xl italic">user/{profile.username}</h2>
      {edit && (
        <Link
          to="edit"
          className="text-lg font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          Edit Profile
        </Link>
      )}
      <Card>{profile.description ?? 'No description'}</Card>
    </div>
  );
}
