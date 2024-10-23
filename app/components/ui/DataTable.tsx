import {
  Cell,
  Column,
  ColumnResizer,
  Group,
  ResizableTableContainer,
  Row,
  Table,
} from 'react-aria-components';
import type { CellProps, ColumnProps, RowProps } from 'react-aria-components';
import { cn } from '~/utils/cn';

export function DataTable({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Table>) {
  return (
    <ResizableTableContainer
      className={cn(
        'w-full overflow-auto scroll-pt-[2.321rem] relative bg-white',
        className
      )}
    >
      <Table {...props} className='border-separate border-spacing-0 z-[2]'>
        {children}
      </Table>
    </ResizableTableContainer>
  );
}

export function DataColumn(props: ColumnProps & { children: React.ReactNode }) {
  return (
    <Column
      {...props}
      className=' z-[2] sticky top-0 text-white bg-black font-bold text-left cursor-default whitespace-nowrap outline-none py-[2em] text-sm uppercase'
    >
      {() => (
        <div className='flex items-center pl-4'>
          <Group
            role='presentation'
            tabIndex={-1}
            className='flex flex-1 items-center overflow-hidden outline-none rounded focus-visible:ring-2 ring-slate-600'
          >
            <span className='flex-1 truncate'>{props.children}</span>
          </Group>
          <ColumnResizer className='w-px px-[8px] py-1 h-5 bg-clip-content bg-slate-400 cursor-col-resize rounded resizing:bg-slate-800 resizing:w-[2px] resizing:pl-[7px] focus-visible:ring-2 ring-slate-600 ring-inset' />
        </div>
      )}
    </Column>
  );
}

export function DataRow<T extends object>({
  className,
  ...props
}: RowProps<T>) {
  return (
    <Row
      {...props}
      className={cn(
        ' selected:bg-light-ciel',
        'cursor-default group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-4 selected:focus-visible:outline-ring',
        className
      )}
    />
  );
}

export function DataCell({ className, ...props }: CellProps) {
  return (
    <Cell
      {...props}
      className={cn(
        'px-2 sm:px-4 max-sm:text-sm py-[1.77em] border-b border-input focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-4 group-selected:focus-visible:outline-none',
        className
      )}
    />
  );
}
