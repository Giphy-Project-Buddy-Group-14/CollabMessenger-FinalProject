import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DEFAULT_FETCH_USERS_LIMIT } from '../../common/constants';
import LoadingIndicator from '../Ui/LoadingIndicator';
import UsersList from '../UsersList/UsersList';
import useUsersPagination from '../../hooks/useUsersPagination';
import SearchBar from '../Ui/SearchBar';

export default function Users() {
  const [usersPerPage, setUsersPerPage] = useState(DEFAULT_FETCH_USERS_LIMIT);

  const { users, currentPage, next, previous, setNewUsers, loading } =
    useUsersPagination(usersPerPage);

  const perPageOptions = [3, 5, 10, 20];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const perPageClickHandler = (event) => {
    event.preventDefault();

    const selectedValue = event.currentTarget.getAttribute(
      'data-per-page-value'
    );
    setUsersPerPage(Number(selectedValue));
    setIsDropdownOpen(false);
  };

  const searchHandler = (filteredUsers) => {
    setNewUsers(filteredUsers);
  };

  return (
    <>
      <SearchBar onSearch={searchHandler} />
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <UsersList users={users} />
          <div className="flex items-center justify-center w-full">
            {/* Invisible Left Spacer (Same width as the 'Per Page' div) */}
            <div className="flex-1">{/* Invisible Spacer */}</div>
            <div className="flex justify-center">
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-20 text-sm">
                  <li>
                    <Link
                      to="#"
                      onClick={previous}
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
                  <li>
                    <Link
                      to="#"
                      onClick={next}
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
            </div>

            {/* Dropdown */}
            <div className="flex-1 flex justify-end">
              <div>
                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="inline-flex items-center justify-center px-5 py-2.5 mb-2 me-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:z-10 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  type="button"
                  onClick={toggleDropdown}
                >
                  {usersPerPage}
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div className="relative">
                  <div
                    id="dropdown"
                    className={` z-10 ${
                      isDropdownOpen ? '' : 'hidden'
                    } bg-white divide-y divide-gray-100 rounded-lg shadow w-16 dark:bg-gray-700`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {perPageOptions.map((option) => (
                        <li key={option}>
                          <Link
                            to="#"
                            className={`block px-4 py-2 ${
                              option === usersPerPage ? 'bg-gray-100' : ''
                            } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                            data-per-page-value={option}
                            onClick={perPageClickHandler}
                          >
                            {option}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
