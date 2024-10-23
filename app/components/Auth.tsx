import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from 'react-aria-components';
import { z } from 'zod';
import { authSchema } from '~/schemas/auth';
import { Button } from './ui/Button';

type AuthFormData = z.infer<typeof authSchema>;

export function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
}: {
  actionText: string;
  onSubmit: (data: AuthFormData) => void;
  status: 'pending' | 'idle' | 'success' | 'error';
  afterSubmit?: React.ReactNode;
}) {
  let { handleSubmit, control } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  return (
    <div className='fixed inset-0 bg-white dark:bg-black max-sm:mx-auto sm:flex items-center justify-center p-6 sm:p-8'>
      <div className='bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold mb-4'>{actionText}</h1>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 w-full sm:w-96'
        >
          <Controller
            control={control}
            name='email'
            rules={{ required: 'Email is required.' }}
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isRequired
                // Let React Hook Form handle validation instead of the browser.
                validationBehavior='aria'
                isInvalid={invalid}
                autoComplete='username'
              >
                <Label className='block text-xs mb-[3px]'>Username</Label>
                <Input
                  ref={ref}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                />
                <FieldError>{error?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            control={control}
            name='password'
            rules={{ required: 'Password is required.' }}
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <TextField
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isRequired
                // Let React Hook Form handle validation instead of the browser.
                validationBehavior='aria'
                isInvalid={invalid}
                autoComplete='current-password'
                type='password'
              >
                <Label className='block text-xs mb-[3px]'>Password</Label>
                <Input
                  ref={ref}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                />
                <FieldError>{error?.message}</FieldError>
              </TextField>
            )}
          />

          <Button
            type='submit'
            className='w-full uppercase'
            isDisabled={status === 'pending'}
          >
            {status === 'pending' ? '...' : actionText}
          </Button>
          {afterSubmit ? afterSubmit : null}
        </Form>
      </div>
    </div>
  );
}
