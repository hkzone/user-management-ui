import { Switch, Label } from 'react-aria-components';
import { useState } from 'react';
import { Permission } from '~/types';
import { cn } from '~/utils/cn';

interface PermissionSwitcherProps {
  selectedPermissions: Permission;
  onChange: (updatedPermissions: Permission) => void;
  isReadOnly: boolean;
  className?: string;
}

export function PermissionSwitcher({
  selectedPermissions,
  onChange,
  isReadOnly,
  className,
}: PermissionSwitcherProps) {
  const [permissions, setPermissions] =
    useState<Permission>(selectedPermissions);

  const handleToggle = (key: keyof Permission) => {
    const updatedPermissions = {
      ...permissions,
      [key]: !permissions[key],
    };
    if (
      key === 'writePosts' &&
      updatedPermissions.writePosts &&
      !updatedPermissions.readPosts
    ) {
      updatedPermissions.readPosts = true;
    }
    if (
      key === 'readPosts' &&
      !updatedPermissions.readPosts &&
      updatedPermissions.writePosts
    ) {
      updatedPermissions.writePosts = false;
    }
    if (
      key === 'writeMessages' &&
      updatedPermissions.writeMessages &&
      !updatedPermissions.readMessages
    ) {
      updatedPermissions.readMessages = true;
    }
    if (
      key === 'readMessages' &&
      !updatedPermissions.readMessages &&
      updatedPermissions.writeMessages
    ) {
      updatedPermissions.writeMessages = false;
    }
    if (
      key === 'writeProfile' &&
      updatedPermissions.writeProfile &&
      !updatedPermissions.readProfile
    ) {
      updatedPermissions.readProfile = true;
    }
    if (
      key === 'readProfile' &&
      !updatedPermissions.readProfile &&
      updatedPermissions.writeProfile
    ) {
      updatedPermissions.writeProfile = false;
    }

    if (updatedPermissions.writeProfile && !updatedPermissions.readProfile) {
      updatedPermissions.readProfile = true;
    }

    setPermissions(updatedPermissions);
    onChange(updatedPermissions);
  };

  return (
    <div className={cn('flex flex-col gap-4 py-1', className)}>
      <div className='text-md font-medium'>Permissions</div>
      <div className='grid grid-cols-2 gap-4'>
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className='flex items-center space-x-2'>
            <Switch
              className='group flex gap-2 items-center text-black font-semibold text-lg'
              isSelected={value}
              onChange={
                isReadOnly
                  ? undefined
                  : () => handleToggle(key as keyof Permission)
              }
              isReadOnly={isReadOnly}
            >
              <div
                className={cn(
                  'flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full shadow-inner bg-clip-padding border border-solid border-white/30 p-[3px] box-border transition duration-200 ease-in-out bg-gray-200',
                  'outline-none group-focus-visible:ring-2 ring-black',
                  {
                    'group-pressed:bg-gray-300 group-selected:bg-gray-400 group-selected:group-pressed:bg-gray-500':
                      !isReadOnly,
                  },
                  { 'bg-ciel': value }
                )}
              >
                <span
                  className={cn(
                    'h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-0',
                    { 'translate-x-[100%]': value }
                  )}
                />
              </div>
            </Switch>
            <Label className='text-sm font-medium '>
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
