import { LoaderFunctionArgs } from 'react-router-dom';
import { Group, createGroup, group, groupMembers, groups } from './api';
import Cookies from 'js-cookie';

export async function loadAllGroups(): Promise<Group[] | undefined> {
  const { data, error } = await groups();
  if (error) {
    console.warn(error);
    return undefined;
  }

  return data;
}

export async function createNewGroup(
  token: string,
  name: string,
): Promise<Group | undefined> {
  const { data, error } = await createGroup(token, {
    name,
  });

  if (error) {
    console.warn(error);
    return undefined;
  }

  return data;
}

export async function loadGroup({
  params,
}: LoaderFunctionArgs): Promise<Group | null> {
  if (params.id) {
    const token = Cookies.get('token');

    const { data, error } = await group(token ?? '', params.id);
    const { data: membersData, error: groupError } = await groupMembers(token ?? '', params.id);

    if (error || groupError) {
      console.warn(error, groupError);
      return null;
    }

    return { ...data, users: membersData };
  }

  return null;
}
