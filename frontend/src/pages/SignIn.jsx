import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Field from '../components/Field';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { getErrorInfo } from '../lib/errors';
import { loginSchema } from '../lib/schemas';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await login(values);
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true });
    } catch (err) {
      setFormError(getErrorInfo(err).message);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your email or username to get back to your profile."
      footer={
        <>
          New to Pillar?{' '}
          <Link to="/signup" className="font-semibold text-brand hover:text-brand-dark">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Alert>{formError}</Alert>
        <Field
          label="Email or username"
          autoComplete="username"
          autoCapitalize="none"
          error={errors.identifier?.message}
          {...register('identifier')}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={isSubmitting} loadingText="Signing in…" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
