'use client';

import Image from 'next/image';
import css from './Edit.module.css';
import { getMe, UpdateData, updateMe } from '@/lib/api/clientApi';
import { useUserStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Edit() {
  const [error, setError] = useState('');
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleUpdate = async (formData: FormData) => {
    try {
      const username = formData.get('username');

      if (typeof username !== 'string' || !username.trim()) {
        setError('Username is required');
        return;
      }
      const res = await updateMe({ username: username.trim() });
      setUser(res);
    } catch (error) {
      setError('Some error, please try again');
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleUpdate}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              defaultValue={user.username}
              type="text"
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={goBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
