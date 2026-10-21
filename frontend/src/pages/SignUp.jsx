import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Field from '../components/Field';
import { useToast } from '../components/Toast';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { getErrorInfo } from '../lib/errors';
import { GENDER_OPTIONS, registerSchema } from '../lib/schemas';

export default function SignUp() {
  const { register: registerUser } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await registerUser(values);
      notify('Account created. Welcome to Pillar!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const { message, fieldErrors } = getErrorInfo(err);
      Object.entries(fieldErrors).forEach(([name, msg]) => setError(name, { type: 'server', message: msg }));
      setFormError(message);
    }
  };

  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="Add your details once. They’re saved securely, and you can update them from your dashboard whenever they change."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-brand hover:text-brand-dark">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Alert>{formError}</Alert>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            autoComplete="name"
            className="sm:col-span-2"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Field
            label="Username"
            autoComplete="username"
            autoCapitalize="none"
            hint="Letters, numbers and underscores"
            error={errors.username?.message}
            {...register('username')}
          />
          <Field
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="+234 801 234 5678"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Field
            label="Email address"
            type="email"
            autoComplete="email"
            className="sm:col-span-2"
            error={errors.email?.message}
            {...register('email')}
          />
          <Field
            label="Date of birth"
            type="date"
            optional
            autoComplete="bday"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          <Field label="Gender" as="select" optional error={errors.gender?.message} {...register('gender')}>
            <option value="">Select…</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Field>
          <Field
            label="Password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters, with upper- and lowercase letters and a number"
            error={errors.password?.message}
            {...register('password')}
          />
          <Field
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-line text-brand focus:ring-brand"
              aria-invalid={errors.acceptedTerms ? true : undefined}
              aria-describedby={errors.acceptedTerms ? 'terms-error' : undefined}
              {...register('acceptedTerms')}
            />
            <span>I accept the terms and conditions</span>
          </label>
          {errors.acceptedTerms && (
            <p id="terms-error" className="mt-1.5 text-sm text-danger">
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} loadingText="Creating account…" className="w-full">
          Sign up
        </Button>
      </form>
    </AuthLayout>
  );
}
