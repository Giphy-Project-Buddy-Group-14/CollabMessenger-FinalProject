import { useState } from 'react';

import { DEFAULT_PER_PAGE_LIMIT } from '../common/constants';

export default function usePagination() {
  const [usersPerPage, setUsersPerPage] = useState(DEFAULT_PER_PAGE_LIMIT);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(totalUsersCount / usersPerPage);

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function previous() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  }

  return {
    setTotalUsersCount,
    usersPerPage,
    setUsersPerPage,
    currentPage,
    maxPage,
    next,
    previous,
    jump,
  };
}
