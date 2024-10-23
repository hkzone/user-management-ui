import { Fragment, useState } from 'react';
import type { SortDescriptor } from 'react-aria-components';
import { TableBody, TableHeader } from 'react-aria-components';
import {
  DataTable,
  DataColumn,
  DataRow,
  DataCell,
} from '~/components/ui/DataTable';
import { RoundButton } from '~/components/ui/RoundButton';
import { ArrowDownIcon, Icon } from '~/icons/icons';
import { PermissionSwitcher } from '~/components/PermissionSwitcher';
import { Invite, Permission } from '~/types';
import { cn } from '~/utils/cn';

interface InvitesTableProps {
  sortedRows: Invite[] | undefined;
  onDelete: (invite: Invite) => void;
  onPermissionChange: (
    inviteId: string,
    updatedPermissions: Permission
  ) => void;
  lastElementRef: (node: HTMLSpanElement) => void;
  showInvitee: boolean;
  onAccept: (invite: Invite) => void;
  onReject: (invite: Invite) => void;
}

export function InvitesTable({
  sortedRows,
  onDelete,
  onPermissionChange,
  lastElementRef,
  showInvitee,
  onAccept,
  onReject,
}: InvitesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleToggleDataRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <DataTable
      aria-label='Invites'
      selectionMode='single'
      selectionBehavior='replace'
    >
      <TableHeader>
        <DataColumn id='inviter' isRowHeader defaultWidth='2fr'>
          {showInvitee ? 'Invitee' : 'Inviter'}
        </DataColumn>
        <DataColumn id='createdAt' defaultWidth='1fr'>
          Date
        </DataColumn>
        <DataColumn id='status' defaultWidth='1fr'>
          Status
        </DataColumn>
        <DataColumn id='actions' defaultWidth='1fr' maxWidth={180}>
          Actions
        </DataColumn>
      </TableHeader>
      <TableBody renderEmptyState={() => 'You have no invites yet.'}>
        {sortedRows?.map((item) => (
          <Fragment key={item.id}>
            <DataRow>
              <DataCell className='break-all'>
                <span ref={lastElementRef}>
                  {showInvitee ? item.invitee.email : item.inviter.email}
                </span>
              </DataCell>
              <DataCell className='font-light tex-xs sm:text-sm break-all'>
                {new Date(item.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </DataCell>
              <DataCell>{item.status}</DataCell>
              <DataCell>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 pr-1.5'>
                  <div className='flex gap-2 flex-col sm:flex-row sm:col-span-2'>
                    {showInvitee ? (
                      <RoundButton
                        onPress={() => onDelete(item)}
                        isDisabled={item.status === 'rejected'}
                        className={cn({
                          invisible: item.status === 'rejected',
                        })}
                      >
                        <Icon
                          name='trash'
                          className={cn({
                            invisible: item.status === 'rejected',
                          })}
                        />
                      </RoundButton>
                    ) : (
                      <>
                        {item.status !== 'rejected' &&
                          item.status !== 'accepted' && (
                            <>
                              <RoundButton
                                onPress={() => onAccept(item)}
                                aria-label='Approve'
                              >
                                <Icon name='checkbox' />
                              </RoundButton>
                              <RoundButton
                                onPress={() => onReject(item)}
                                aria-label='Reject'
                              >
                                <Icon name='cross' />
                              </RoundButton>
                            </>
                          )}
                      </>
                    )}
                  </div>
                  <RoundButton
                    className={cn('bg-transparent', {
                      invisible: item.status === 'rejected',
                      '[&_.icon]:-rotate-90':
                        item.status !== 'rejected' && expandedRows.has(item.id),
                    })}
                    onPress={() => handleToggleDataRow(item.id)}
                    isDisabled={item.status === 'rejected'}
                    aria-label='Expand row'
                    aria-expanded={expandedRows.has(item.id)}
                  >
                    <ArrowDownIcon />
                  </RoundButton>
                </div>
              </DataCell>
            </DataRow>
            {expandedRows.has(item.id) && (
              <DataRow className='relative h-48'>
                <DataCell className='absolute'>
                  <div className='p-4 pt-1'>
                    <PermissionSwitcher
                      selectedPermissions={item.permissions}
                      onChange={(updatedPermissions) =>
                        onPermissionChange(item.id, updatedPermissions)
                      }
                      isReadOnly={!showInvitee}
                    />
                  </div>
                </DataCell>
                <DataCell />
                <DataCell />
                <DataCell />
              </DataRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </DataTable>
  );
}
