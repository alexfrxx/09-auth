import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { Note, PostNote } from '../../types/note';
import type { FetchNotesProps, SearchNotesProps } from './clientApi';
import User from '@/types/user';

const key = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

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
  const { data } = await nextServer.get('/auth/me', {
    headers: {
      Cookie: cookieStore.toString()
    }
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        Cookie: cookieStore.toString()
      }
    }
  );
  return response.data;
}

export async function fetchNotes({
  search,
  page,
  perPage,
  tag
}: SearchNotesProps): Promise<FetchNotesProps> {
  const cookieStore = await cookies();
  const response = await nextServer.get<FetchNotesProps>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        search,
        page,
        perPage,
        tag
      },
      headers: {
        Authorization: `Bearer ${key}`,
        Cookie: cookieStore.toString()
      }
    }
  );
  return response.data;
}
