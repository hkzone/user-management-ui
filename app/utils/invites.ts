import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/start';
import invitesData from '../data/invites.json';
import userData from '../data/users.json';
import { Invite, Permission } from '~/types';

const MAX_POST_PAGE = 10;

export const fetchInvites = createServerFn(
  'GET',
  async ({
    pageParam = 1,
    type,
    userEmail,
  }: {
    pageParam: number;
    type: 'given' | 'received';
    userEmail: string;
  }) => {
    console.info(
      `Fetching ${type} invites for user ${userEmail}, page ${pageParam}...`
    );
    const filteredInvites = invitesData.filter((invite) =>
      type === 'given'
        ? invite.inviter.email === userEmail
        : invite.invitee.email === userEmail
    );
    const startIndex = (pageParam - 1) * MAX_POST_PAGE;
    const endIndex = startIndex + MAX_POST_PAGE;
    return filteredInvites.slice(startIndex, endIndex);
  }
);

export const deleteInvite = createServerFn('POST', async (inviteId: string) => {
  console.info(`Rejecting invite with id ${inviteId}...`);
  try {
    const inviteIndex = invitesData.findIndex(
      (invite) => invite.id === inviteId
    );
    if (inviteIndex === -1) {
      throw new Error(`Invite with id ${inviteId} not found`);
    }

    // Update the status to "rejected"
    invitesData[inviteIndex].status = 'rejected';

    //WARN Update DB in real app

    return { success: true, updatedInvite: invitesData[inviteIndex] };
  } catch (err) {
    console.error('Error rejecting invite:', err);
    throw err;
  }
});

export const updateInvitePermissions = createServerFn(
  'POST',
  async ({
    inviteId,
    permissions,
  }: {
    inviteId: string;
    permissions: Permission;
  }) => {
    console.info(`Updating permissions for invite ${inviteId}...`);
    try {
      const inviteIndex = invitesData.findIndex(
        (invite) => invite.id === inviteId
      );
      if (inviteIndex === -1) {
        throw new Error(`Invite with id ${inviteId} not found`);
      }

      // Update the permissions
      invitesData[inviteIndex].permissions = {
        ...invitesData[inviteIndex].permissions,
        ...permissions,
      };

      //WARN Update DB in real app

      return { success: true, updatedInvite: invitesData[inviteIndex] };
    } catch (err) {
      console.error('Error updating invite permissions:', err);
      throw err;
    }
  }
);

export const handleInviteAction = createServerFn(
  'POST',
  async ({
    inviteId,
    action,
  }: {
    inviteId: string;
    action: 'accept' | 'reject';
  }) => {
    console.info(
      `${action === 'accept' ? 'Accepting' : 'Rejecting'} invite with id ${inviteId}...`
    );
    try {
      const inviteIndex = invitesData.findIndex(
        (invite) => invite.id === inviteId
      );
      if (inviteIndex === -1) {
        throw new Error(`Invite with id ${inviteId} not found`);
      }

      // Update the status to "accepted" or "rejected"
      invitesData[inviteIndex].status =
        action === 'accept' ? 'accepted' : 'rejected';

      //WARN Update DB in real app

      return { success: true, updatedInvite: invitesData[inviteIndex] };
    } catch (err) {
      console.error(
        `Error ${action === 'accept' ? 'accepting' : 'rejecting'} invite:`,
        err
      );
      throw err;
    }
  }
);

export const sendInvite = createServerFn(
  'POST',
  async ({
    email,
    permissions,
    inviterEmail,
  }: {
    email: string;
    permissions: Permission;
    inviterEmail: string;
  }) => {
    console.info(`Sending invite to ${email}...`);
    try {
      const inviter = userData.find((user) => user.email === inviterEmail);
      const invitee = userData.find((user) => user.email === email);

      if (!inviter || !invitee) {
        throw new Error('Inviter or invitee not found');
      }

      const newInvite: Invite = {
        id: Math.random().toString(36).substr(2, 9), //WARN Just for demo
        inviter: {
          id: inviter.id,
          username: inviter.username,
          email: inviter.email,
          isVerified: inviter.isVerified,
        },
        invitee: {
          id: invitee.id,
          username: invitee.username,
          email: invitee.email,
          isVerified: invitee.isVerified,
        },
        permissions,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      invitesData.push(newInvite);

      //WARN Update DB in real app

      return { success: true, newInvite };
    } catch (err) {
      console.error('Error sending invite:', err);
      throw err;
    }
  }
);

export const getInvitesForUser = (userEmail: string): Invite[] => {
  return invitesData.filter((invite) => invite.invitee.email === userEmail);
};
