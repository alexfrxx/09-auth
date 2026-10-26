import ReactPaginateModule from 'react-paginate';
import ReactPaginate from 'react-paginate';

import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage: number;
}

export default function Pagination({
  pageCount,
  onPageChange,
  forcePage
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      pageRangeDisplayed={5}
      nextLabel="→"
      previousLabel="←"
      activeClassName={css.active}
      containerClassName={css.pagination}
      marginPagesDisplayed={1}
      forcePage={forcePage}
    />
  );
}
