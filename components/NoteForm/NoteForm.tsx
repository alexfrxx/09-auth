'use client';

import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { postNote } from '../../lib/api/clientApi';
import css from './NoteForm.module.css';
import type { PostNote, TagProps } from '../../types/note';
import { useDraft } from '@/lib/store/noteStore';

interface FormValues {
  title: string;
  content: string;
  tag: TagProps;
}

const initialValues: FormValues = {
  title: '',
  content: '',
  tag: 'Todo'
};

export default function NoteForm() {
  const queryClient = useQueryClient();
  const id = useId();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useDraft();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value
    });
  };

  const routeBack = () => {
    router.back();
  };

  const mutation = useMutation({
    mutationFn: postNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({
        queryKey: ['notes']
      });
      router.push('/notes/filter/all');
    }
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as TagProps;

    const data = Object.fromEntries(formData);
    mutation.mutate({
      title,
      content,
      tag
    });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          id={`${id}-title`}
          type="text"
          name="title"
          onChange={handleChange}
          className={css.input}
          defaultValue={draft?.title}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content</label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          onChange={handleChange}
          defaultValue={draft?.content}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        <select
          id={`${id}-tag`}
          name="tag"
          className={css.select}
          onChange={handleChange}
          defaultValue={draft?.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={routeBack} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}
