'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchNotes } from '../../../../../lib/api/clientApi';
import NoteList from '../../../../../components/NoteList/NoteList';
import Pagination from '../../../../../components/Pagination/Pagination';
import css from './NotesPage.module.css';
import SearchBox from '../../../../../components/SearchBox/SearchBox';

type Props = {
  tag: string | undefined;
};

export default function NotesClient({ tag }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setPage(1);
  };

  const [debouncedSearch] = useDebounce(inputValue, 1000);

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearch, page, tag],
    queryFn: () => {
      return fetchNotes({
        search: debouncedSearch,
        page,
        perPage: 12,
        tag
      });
    },
    placeholderData: keepPreviousData,
    refetchOnMount: false
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleChange} />
        {data && data?.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
