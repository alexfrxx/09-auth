import axios from 'axios';
import type { Note, PostNote } from '../../types/note';
import { nextServer } from './api';
import type { User } from '@/types/user';

const key = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface FetchNotesProps {
  notes: Note[];
  totalPages: number;
}

export interface SearchNotesProps {
  search?: string;
  page: number;
  perPage: number;
  tag?: string;
}

export type RegisterData = {
  email: string;
  password: string;
};

export type UpdateData = {
  username: string;
};

export type SessionType = {
  success: boolean;
};

export async function fetchNotes({
  search,
  page,
  perPage,
  tag
}: SearchNotesProps): Promise<FetchNotesProps> {
  const response = await nextServer.get<FetchNotesProps>('/notes', {
    params: {
      search,
      page,
      perPage,
      tag
    },
    headers: {
      Authorization: `Bearer ${key}`
    }
  });
  return response.data;
}

export async function postNote(object: PostNote): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', object, {
    headers: {
      Authorization: `Bearer ${key}`
    }
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${key}`
    }
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${key}`
    }
  });
  return response.data;
}

export async function register(data: RegisterData): Promise<User> {
  const response = await nextServer.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: RegisterData): Promise<User> {
  const response = await nextServer.post<User>('/auth/login', data);
  return response.data;
}

export async function checkSession() {
  const response = await nextServer.get<SessionType>('/auth/session');
  return response.data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export async function updateMe({ username }: UpdateData): Promise<User> {
  const response = await nextServer.patch('/users/me', { username });
  return response.data;
}
