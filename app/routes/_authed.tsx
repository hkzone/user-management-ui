import { createFileRoute } from '@tanstack/react-router';
import { createServerFn, json } from '@tanstack/start';
import { hashPassword } from '~/utils/hash-password';
import { Login } from '~/components/Login';
import { useAppSession } from '~/utils/session';
import { getInvitesForUser } from '~/utils/invites';

import userData from '../data/users.json';

export const loginFn = createServerFn(
  'POST',
  async (
    payload: {
      email: string;
      password: string;
    },
    { request }
  ) => {
    // Find the user
    const user = userData.find((user) => user.email === payload.email);

    // Check if the user exists
    if (!user) {
      return {
        error: true,
        userNotFound: true,
        message: 'User not found',
      };
    }

    // Check if the password is correct
    const hashedPassword = await hashPassword(payload.password);

    if (user.password !== hashedPassword) {
      return {
        error: true,
        message: 'Incorrect password',
      };
    }

    // Check if user is verified or has invites received from verified users
    if (!user.isVerified) {
      const invites = getInvitesForUser(user.email);

      const hasVerifiedInvite = invites.some(
        (invite) => invite.inviter.isVerified
      );

      if (!hasVerifiedInvite) {
        return {
          error: true,
          message:
            'User is not verified and has no invites from verified users',
        };
      }
    }

    // Create a session
    const session = await useAppSession();

    // Store the user's email in the session
    await session.update({
      userEmail: user.email,
    });
  }
);

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login />;
    }

    throw error;
  },
});
