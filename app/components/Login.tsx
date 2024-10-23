import { useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { loginFn } from '../routes/_authed';
import { Auth } from './Auth';
import { authSchema } from '~/schemas/auth';
import { z } from 'zod';

type AuthFormData = z.infer<typeof authSchema>;

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: async (data) => {
      if (!data?.error) {
        await router.invalidate();
        router.navigate({ to: '/' });
      }
    },
  });

  return (
    <Auth
      actionText='Login'
      status={loginMutation.status}
      onSubmit={(formData: AuthFormData) => {
        const { email, password } = formData;

        loginMutation.mutate({
          email,
          password,
        });
      }}
      afterSubmit={
        loginMutation.data ? (
          <>
            <div className='text-red-400'>{loginMutation.data.message}</div>
          </>
        ) : null
      }
    />
  );
}
