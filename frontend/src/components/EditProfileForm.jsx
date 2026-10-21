import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { getErrorInfo } from '../lib/errors';
import { GENDER_OPTIONS, profileSchema } from '../lib/schemas';
import Alert from './Alert';
import Button from './Button';
import Field from './Field';
import { useToast } from './Toast';

export default function EditProfileForm({ onDone }) {
  const { user, updateProfile } = useAuth();
  const { notify } = useToast();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth ?? '',
      gender: user.gender ?? '',
    },
  });

  const onSubmit = async (values) => {
    setFormError('');
    if (!isDirty) return onDone();
    try {
      await updateProfile(values);
      notify('Profile updated');
      onDone();
    } catch (err) {
      const { message, fieldErrors } = getErrorInfo(err);
      Object.entries(fieldErrors).forEach(([name, msg]) => setError(name, { type: 'server', message: msg }));
      setFormError(message);
    }
  };

  return (
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
          label="Phone number"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
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
          <option value="">Not provided</option>
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Field>
      </div>
      <p className="text-sm text-muted">Your username and email can’t be changed here.</p>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isSubmitting} loadingText="Saving…">
          Save changes
        </Button>
        <Button variant="secondary" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
