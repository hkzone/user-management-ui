import { Button, ButtonProps, ButtonRenderProps } from 'react-aria-components';
import { ProgressCircle } from './ProgressCircle';
import { cn } from '~/utils/cn';

export function RoundButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        'bg-light-ciel rounded-full w-8 h-8 flex justify-center items-center relative',
        'text-black hover:text-white duration-300',
        'after:absolute  after:rounded-full after:w-full after:h-full after:pointer-events-none',
        'after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2',
        'after:transition-all after:duration-300 after:ease-[cubic-bezier(0.18,0.89,0.32,1.27)]',
        'after:bg-black after:scale-[0.6] after:opacity-0',
        'hover:after:scale-100 hover:after:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.className
      )}
    >
      {(renderProps: ButtonRenderProps) => (
        <div className='z-[1]'>
          {!renderProps.isPending && (
            <div
              className={cn({
                'scale-[0.97]': renderProps.isPressed,
              })}
            >
              {typeof children === 'function'
                ? (children as (props: ButtonRenderProps) => React.ReactNode)(
                    renderProps
                  )
                : children}
            </div>
          )}
          {renderProps.isPending && (
            <ProgressCircle aria-label='Saving...' isIndeterminate />
          )}
        </div>
      )}
    </Button>
  );
}
