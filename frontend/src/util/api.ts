import createClient from 'openapi-fetch';
import type { paths, components } from './v1.d.ts';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

export type Group = components['schemas']['Group'];
export type User = components['schemas']['User'];
export type NewGroup = components['schemas']['NewGroup'];
export type UpdateUser = components['schemas']['UpdateUser'];

const { GET, POST, PATCH } = createClient<paths>({ baseUrl: API_URL });

export const profile = (token: string) =>
  GET('/api/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const user = (username: string) =>
  GET('/api/user/{username}', {
    params: {
      path: {
        username,
      },
    },
  });

export const updateUser = (token: string, username: string, body: UpdateUser) =>
  PATCH('/api/user/{username}', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: {
        username,
      },
    },
    body,
  });

export const addMinecraftToUser = (token: string, msToken: string) =>
  POST('/api/connections/minecraft', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      header: {
        Ms_authorization: msToken,
      },
    },
  });

export const group = (token: string, id: string) =>
  GET('/api/groups/{id}', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: {
        id,
      },
    },
  });

export const groups = () => GET('/api/groups');

export const createGroup = (token: string, body: NewGroup) =>
  POST('/api/groups', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  });

export const joinGroup = (token: string, id: string) =>
  POST('/api/groups/{id}/join', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: {
        id,
      },
    },
  });
