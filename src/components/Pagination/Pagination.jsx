import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


import { DEFAULT_FETCH_USERS_LIMIT } from '../../common/constants';
export default function Pagination({ currentPage, onPreviousPageClick, onNextPageClick }) {
  const [isLoading, setIsLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalUserCount, setTotalUserCount] = useState(0);

  const totalPages = () =>
    Math.ceil(totalUserCount / DEFAULT_FETCH_USERS_LIMIT);

  const nextPageHandler = (event) => {
    event.preventDefault();
    if (currentPage < totalPages()) {
      // setCurrentPage((prevPage) => {
      //   const pageNumber = prevPage + 1;
      //   changePageTo(pageNumber);
      //   return pageNumber;
      // });

      const nextPage = currentPage + 1;
      // setCurrentPage(nextPage);
      onNextPageClick(nextPage);
    }
  };

  const previousPageHandler = (event) => {
    event.preventDefault();

    if (currentPage > 1) {
      // setCurrentPage((prevPage) => prevPage - 1);
      const previousPage = currentPage + 1;
      onPreviousPageClick(previousPage);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchUserCount = async () => {
      try {
        const userCount = 9; // await fetchTotalUserCount();
        console.log('userCount --> ', userCount);
        setTotalUserCount(userCount);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUserCount();

    setIsLoading(false);
  }, []);

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <Link
              to="#"
              onClick={previousPageHandler}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              to="#"
              aria-current="page"
              className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              {currentPage}
            </Link>
          </li>
          {/* <li>
            <Link
              to="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              3
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              4
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              5
            </Link>
          </li> */}
          <li>
            <Link
              to="#"
              onClick={nextPageHandler}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
