import { LoaderFunctionArgs } from 'react-router-dom';
import { User, user } from './api';

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<User | null> {
  if (params.username) {
    const { data, error } = await user(params.username);
    if (error) {
      console.error(error);
      return null;
    }

    return data;
  }

  return null;
}

export function canEdit(profile: User | undefined, userToEdit: string) {
  return profile?.username === userToEdit || profile?.admin;
}
