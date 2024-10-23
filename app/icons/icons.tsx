import { cn } from '~/utils/cn';
import iconsHref from './icons.svg?url';

export function Icon({
  name,
  size = 'md',
  spin = false,
  className = '',
}: {
  name: string;
  size?: 'md' | 'xl';
  spin?: boolean;
  className?: string;
}) {
  const classNames = {
    md: 'w-5 h-5',
    xl: 'w-8 h-8',
  };
  return (
    <svg
      className={cn(
        `${classNames[size]} inline self-center ${spin ? 'animate-spin' : ''}`,
        className
      )}
    >
      <use href={`${iconsHref}#${name}`} />
    </svg>
  );
}

export function LoginIcon() {
  return (
    <svg className='inline self-center w-8 h-8 text-white transform scale-x-[-1]'>
      <use href={`${iconsHref}#login`} />
    </svg>
  );
}

export function LogoutIcon() {
  return (
    <svg className='inline self-center w-8 h-8 text-white'>
      <use href={`${iconsHref}#logout`} />
    </svg>
  );
}

export function ArrowUpIcon() {
  return (
    <svg className='inline self-center w-2 h-2.5 '>
      <use href={`${iconsHref}#arrow-up`} />
    </svg>
  );
}

export function ArrowDownIcon() {
  return (
    <div className='icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rotate-90  transition-transform duration-100 flex justify-center items-center'>
      <svg className='inline self-center w-[12.8px] h-[11.88px] '>
        <use href={`${iconsHref}#arrow`} />
      </svg>
    </div>
  );
}
