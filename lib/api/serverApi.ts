import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { Note, PostNote } from '../../types/note';
import type { FetchNotesProps, SearchNotesProps } from './clientApi';
import type { User } from '@/types/user';

export async function checkServerSession() {
  const cookieStore = await cookies();
  const response = await nextServer.get('/auth/session', {
    headers: {
      Cookies: cookieStore.toString()
    }
  });
  return response;
}

export async function getServerMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookies: cookieStore.toString()
    }
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookies: cookieStore.toString()
    }
  });
  return response.data;
}

export async function fetchNotes({
  search,
  page,
  perPage,
  tag
}: SearchNotesProps): Promise<FetchNotesProps> {
  const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesProps>('/notes', {
    params: {
      search,
      page,
      perPage,
      tag
    },
    headers: {
      Cookies: cookieStore.toString()
    }
  });
  return response.data;
}
