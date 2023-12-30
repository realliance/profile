import { LoaderFunctionArgs } from 'react-router-dom';
import { createGroup, group, groups } from './api';
import { User } from './user';
import Cookies from 'js-cookie';

export interface Group {
  id: string;
  name: string;
  users: User[];
}

export async function loadAllGroups(): Promise<Group[] | undefined> {
  const res = await groups();
  if (res.status === 200) {
    return (await res.json()) as Group[];
  }

  return undefined;
}

export async function createNewGroup(
  token: string,
  name: string,
): Promise<Group | undefined> {
  const res = await createGroup(token, {
    name,
    users: [],
  });

  if (res.status === 201) {
    return (await res.json()) as Group;
  }

  return undefined;
}

export async function loadGroup({
  params,
}: LoaderFunctionArgs): Promise<Group | undefined> {
  if (params.id) {
    const token = Cookies.get('token');

    const res = await group(token ?? '', params.id);
    if (res.status === 200) {
      return (await res.json()) as Group;
    }
  }

  return undefined;
}
