import {
  QueryClient,
  HydrationBoundary,
  dehydrate
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { fetchNotes } from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: `Filtered by ${tag}`,
    description: `Filtered notes by ${tag}`,
    openGraph: {
      title: `Filtered by ${tag}`,
      description: `Filtered notes by ${tag}`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Filtered by ${tag}`
        }
      ]
    }
  };
}

async function Notes({ params }: Props) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => {
      return fetchNotes({
        search: '',
        page: 1,
        perPage: 12,
        tag
      });
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default Notes;
