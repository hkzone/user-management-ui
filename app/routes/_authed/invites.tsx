import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type TabPanelProps,
  type TabProps,
} from 'react-aria-components';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { SortDescriptor } from 'react-aria-components';

import {
  fetchInvites,
  deleteInvite,
  updateInvitePermissions,
  handleInviteAction,
  sendInvite,
} from '~/utils/invites';
import { useCallback, useMemo, useRef, useState } from 'react';
import { InvitesTable } from '~/components/InvitesTable';
import { Invite, Permission } from '~/types';
import { InviteUser } from '~/components/InviteUser';
import { cn } from '~/utils/cn';

export const Route = createFileRoute('/_authed/invites')({
  loader: async ({ context }) => {
    // We'll load the initial data in the component
  },
  meta: () => [{ title: 'Invites' }],
  component: InvitesComponent,
});

function InvitesComponent() {
  const { user } = Route.useRouteContext();
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');

  const observer = useRef<IntersectionObserver>();

  const {
    data: givenData,
    fetchNextPage: fetchNextGivenPage,
    hasNextPage: hasNextGivenPage,
    isFetching: isGivenFetching,
    isLoading: isGivenLoading,
    isError: isGivenError,
    error: givenError,
  } = useInfiniteQuery({
    queryKey: ['invites', 'given', user?.email],
    queryFn: ({ pageParam = 1 }) =>
      fetchInvites({ pageParam, type: 'given', userEmail: user?.email ?? '' }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const {
    data: receivedData,
    fetchNextPage: fetchNextReceivedPage,
    hasNextPage: hasNextReceivedPage,
    isFetching: isReceivedFetching,
    isLoading: isReceivedLoading,
    isError: isReceivedError,
    error: receivedError,
  } = useInfiniteQuery({
    queryKey: ['invites', 'received', user?.email],
    queryFn: ({ pageParam = 1 }) =>
      fetchInvites({
        pageParam,
        type: 'received',
        userEmail: user?.email ?? '',
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const invitesGiven = useMemo(() => {
    return givenData?.pages.reduce((acc, page) => [...acc, ...page], []);
  }, [givenData]);

  const invitesReceived = useMemo(() => {
    return receivedData?.pages.reduce((acc, page) => [...acc, ...page], []);
  }, [receivedData]);

  const lastElementRef = useCallback(
    (node: HTMLSpanElement) => {
      if (isGivenLoading || isReceivedLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === 'given' && hasNextGivenPage && !isGivenFetching) {
            fetchNextGivenPage();
          } else if (
            activeTab === 'received' &&
            hasNextReceivedPage &&
            !isReceivedFetching
          ) {
            fetchNextReceivedPage();
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [
      activeTab,
      fetchNextGivenPage,
      fetchNextReceivedPage,
      hasNextGivenPage,
      hasNextReceivedPage,
      isGivenFetching,
      isGivenLoading,
      isReceivedFetching,
      isReceivedLoading,
    ]
  );

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (inviteId: string) => deleteInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'invites',
          activeTab === 'received' ? 'received' : 'given',
          user?.email,
        ],
      });
    },
  });

  const handleDelete = useCallback(
    async (invite: Invite) => {
      try {
        await deleteMutation.mutateAsync(invite.id);
        console.log(`Invite ${invite.id} rejected successfully`);
      } catch (error) {
        console.error('Failed to reject invite:', error);
      }
    },
    [deleteMutation]
  );

  const updatePermissionsMutation = useMutation({
    mutationFn: ({
      inviteId,
      permissions,
    }: {
      inviteId: string;
      permissions: Permission;
    }) => updateInvitePermissions({ inviteId, permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });

  const handlePermissionChange = useCallback(
    async (inviteId: string, updatedPermissions: Permission) => {
      try {
        await updatePermissionsMutation.mutateAsync({
          inviteId,
          permissions: updatedPermissions,
        });
        console.log(`Permissions updated successfully for invite ${inviteId}`);
      } catch (error) {
        console.error('Failed to update permissions:', error);
      }
    },
    [updatePermissionsMutation]
  );

  const inviteActionMutation = useMutation({
    mutationFn: ({
      inviteId,
      action,
    }: {
      inviteId: string;
      action: 'accept' | 'reject';
    }) => handleInviteAction({ inviteId, action }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'invites',
          activeTab === 'received' ? 'received' : 'given',
          user?.email,
        ],
      });
    },
  });

  const handleInvite = useCallback(
    async (inviteId: string, action: 'accept' | 'reject') => {
      console.log(`Invite ${inviteId} ${action}ed`);

      try {
        await inviteActionMutation.mutateAsync({ inviteId, action });
        console.log(`Invite ${inviteId} ${action}ed successfully`);
      } catch (error) {
        console.error(`Failed to ${action} invite:`, error);
      }
    },
    [inviteActionMutation]
  );

  const sendInviteMutation = useMutation({
    mutationFn: ({
      email,
      permissions,
      inviterEmail,
    }: {
      email: string;
      permissions: Permission;
      inviterEmail: string;
    }) => sendInvite({ email, permissions, inviterEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invites', 'given', user?.email],
      });
    },
  });

  const handleSendInvite = useCallback(
    async (email: string, permissions: Permission) => {
      console.log(email, permissions);
      try {
        await sendInviteMutation.mutateAsync({
          email,
          permissions,
          inviterEmail: user?.email ?? '',
        });
        console.log(`Invite sent successfully to ${email}`);
      } catch (error) {
        console.error('Failed to send invite:', error);
      }
    },
    [sendInviteMutation]
  );

  if (isGivenLoading || isReceivedLoading) return <div>Loading...</div>;
  if (isGivenError)
    return (
      <div>An error occurred: {givenError?.message || 'Unknown error'}</div>
    );
  if (isReceivedError)
    return (
      <div>An error occurred: {receivedError?.message || 'Unknown error'}</div>
    );

  return (
    <div className='py-8 px-2 sm:px-8  flex justify-center'>
      <Tabs
        className='w-full '
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as 'given' | 'received')}
      >
        <TabList
          aria-label='Feeds'
          className='flex flex-shrink justify-center sm:justify-start space-x-1 rounded-full bg-clip-padding p-1 pb-4'
        >
          <InvitesTab id='given' className=''>
            Invites Given
          </InvitesTab>
          <InvitesTab id='received'>Invites Received</InvitesTab>
        </TabList>
        <InvitesTabPanel id='given'>
          <InviteUser onInvite={handleSendInvite} />
          <InvitesTable
            sortedRows={invitesGiven}
            onDelete={handleDelete}
            onAccept={(invite) => handleInvite(invite.id, 'accept')}
            onReject={(invite) => handleInvite(invite.id, 'reject')}
            onPermissionChange={handlePermissionChange}
            lastElementRef={lastElementRef}
            showInvitee={true}
          />
        </InvitesTabPanel>
        <InvitesTabPanel id='received' className='pt-4'>
          <InvitesTable
            sortedRows={invitesReceived}
            onDelete={handleDelete}
            onAccept={(invite) => handleInvite(invite.id, 'accept')}
            onReject={(invite) => handleInvite(invite.id, 'reject')}
            onPermissionChange={handlePermissionChange}
            lastElementRef={lastElementRef}
            showInvitee={false}
          />
        </InvitesTabPanel>
        <Outlet />
      </Tabs>
    </div>
  );
}

function InvitesTab(props: TabProps) {
  return (
    <Tab
      {...props}
      className={({ isSelected }) => `
         rounded-full cursor-pointer py-2.5 px-4 font-medium text-[1.1em] text-center  ring-ring outline-none transition-colors focus-visible:ring-2  focus-visible:ring-offset-2
        ${
          isSelected
            ? 'text-white bg-black shadow'
            : 'text-black hover:bg-ciel/40 pressed:hover:bg-ciel/40'
        }
      `}
    />
  );
}

function InvitesTabPanel({ className, ...props }: TabPanelProps) {
  return (
    <TabPanel
      {...props}
      className={cn(
        'mt-2 ring-black outline-none focus-visible:ring-2  focus-visible:ring-offset-2',
        className
      )}
    />
  );
}
