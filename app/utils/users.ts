import { createServerFn } from '@tanstack/start';
import { queryOptions } from '@tanstack/react-query';

import userData from '../data/users.json';

export const searchUsers = createServerFn(
  'GET',
  async ({ query }: { query: string }) => {
    return userData.filter(
      (user) =>
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
  }
);

export const searchUsersOptions = (query: string) =>
  queryOptions({
    queryKey: ['searchUsers', query],
    queryFn: () => searchUsers({ query }),
  });
