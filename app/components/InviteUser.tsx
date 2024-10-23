import { useState, useCallback, useMemo } from 'react';
import {
  ComboBox,
  Dialog,
  DialogTrigger,
  Input,
  ListBoxItem,
  Label,
  ListBox,
  Popover,
  Modal,
  ModalOverlay,
  Heading,
  ButtonProps,
  Group,
  ListBoxItemProps,
} from 'react-aria-components';
import { PermissionSwitcher } from '~/components/PermissionSwitcher';
import { Permission, User } from '~/types';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { searchUsersOptions } from '~/utils/users';
import { Icon } from '~/icons/icons';
import { Button } from './ui/Button';

interface InviteUserProps {
  onInvite: (email: string, permissions: Permission) => void;
}

export function InviteUser({ onInvite }: InviteUserProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 300);

  const [permissions, setPermissions] = useState<Permission>({
    readPosts: false,
    writePosts: false,
    readMessages: false,
    writeMessages: false,
    readProfile: false,
    writeProfile: false,
  });

  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery(
    searchUsersOptions(debouncedInputValue)
  );

  const options = useMemo(() => {
    return (
      users?.map((user) => ({
        id: user.id,
        email: user.email,
      })) || []
    );
  }, [users]);

  const handleInviteClick = useCallback(() => {
    if (selectedUser) {
      const hasPermissions = Object.values(permissions).some(Boolean);
      if (!hasPermissions) {
        setError('Please select at least one permission.');
        setIsDialogOpen(false);
      } else {
        setError(null);
        setIsDialogOpen(true);
      }
    }
  }, [selectedUser, permissions]);

  const handleConfirmInvite = useCallback(() => {
    if (selectedUser) {
      const hasPermissions = Object.values(permissions).some(Boolean);
      if (hasPermissions) {
        onInvite(selectedUser.email, permissions);
        setSelectedUser(null);
        setInputValue('');
        setPermissions({
          readPosts: false,
          writePosts: false,
          readMessages: false,
          writeMessages: false,
          readProfile: false,
          writeProfile: false,
        });
        setError(null);
      }
    }
  }, [selectedUser, permissions, onInvite]);

  return (
    <div className='space-y-4 pb-8 flex flex-col max-sm:px-4 max-sm:items-center'>
      <ComboBox
        className='group flex flex-col gap-1 w-full'
        aria-label='Select user to invite'
        items={options}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        onSelectionChange={(selected) => {
          const user = users?.find((user: User) => {
            return user.id === selected;
          });
          if (user) {
            setSelectedUser(user);
            setInputValue(user.email);
          }
        }}
      >
        <Label className='text-black cursor-default pb-1'>
          Select user to invite
        </Label>
        <Group className='flex rounded-lg bg-white bg-opacity-90 focus-within:bg-opacity-100 transition shadow-md ring-1 ring-black/10 focus-visible:ring-2 focus-visible:ring-black'>
          <Input className='flex-1 w-full border-none py-2 px-3 leading-5 text-gray-900 bg-transparent outline-none text-base' />
          <Button className='px-3 flex items-center text-gray-700 transition border-0 border-solid border-l border-l-sky-200 bg-transparent rounded-r-lg pressed:bg-sky-100'>
            ▼
          </Button>
        </Group>
        <Popover className='max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out'>
          <ListBox className='outline-none p-1'>
            {isLoading ? (
              <UserItem>Loading...</UserItem>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <UserItem id={user.id} key={user.id} textValue={user.email}>
                  {user.email}
                </UserItem>
              ))
            ) : (
              <UserItem>No users found</UserItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>

      {selectedUser && (
        <PermissionSwitcher
          className='max-w-[400px]'
          selectedPermissions={permissions}
          onChange={setPermissions}
          isReadOnly={false}
        />
      )}

      {error && <p className='text-red-500 mt-2'>{error}</p>}

      <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          isDisabled={!selectedUser}
          onPress={handleInviteClick}
          className='w-fit'
        >
          Invite User
        </Button>
        <ModalOverlay
          className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
          ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
        `}
        >
          <Modal
            className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}
          >
            <Dialog role='alertdialog' className='outline-none relative'>
              {({ close }) => (
                <>
                  <Heading
                    slot='title'
                    className='text-xxl font-semibold leading-6 mb-2 text-slate-700'
                  >
                    Confirm Invitation
                  </Heading>
                  <p className='mb-4'>
                    Are you sure you want to invite {selectedUser?.email} with
                    the following permissions?
                  </p>
                  <ul className='list-disc list-inside mb-4'>
                    {Object.entries(permissions)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => (
                        <li key={key}>
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </li>
                      ))}
                  </ul>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='secondary'
                      onPress={() => {
                        close();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        handleConfirmInvite();
                        close();
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
}

function UserItem(props: ListBoxItemProps & { children: React.ReactNode }) {
  return (
    <ListBoxItem
      {...props}
      className='group flex items-center gap-2 cursor-default select-none py-2 pl-2 pr-4 outline-none rounded text-black/90 focus:bg-light-ciel focus:text-black'
    >
      {({ isSelected }) => (
        <>
          <span className='flex-1 flex items-center gap-3 truncate font-normal group-selected:font-medium'>
            {props.children}
          </span>
          {isSelected && (
            <span className='w-5 flex items-center text-black/90 group-focus:text-black'>
              <Icon name='checkbox' />
            </span>
          )}
        </>
      )}
    </ListBoxItem>
  );
}
