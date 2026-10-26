'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, RegisterData } from '../../../lib/api/clientApi';
import { useUserStore } from '@/lib/store/authStore';
import css from './SignUp.module.css';

export default function SignUp() {
  const [error, setError] = useState('');
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const value = Object.fromEntries(formData) as RegisterData;

      const res = await register(value);

      if (res) {
        setUser(res);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Oops... some error');
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
