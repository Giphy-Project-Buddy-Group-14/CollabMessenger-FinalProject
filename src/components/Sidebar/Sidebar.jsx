import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { USER_PROFILE_PATH, USERS_PATH } from '../../common/routes';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { loading, isAuthenticated, currentUserProfile } = useAuth();

  const signOutHandler = (event) => {
    event.preventDefault();
    logout();
    navigate('/signin');
  };

  return (
    <>
      {loading}
      {!loading && (
        <>
          <button
            data-drawer-target="default-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"
            type="button"
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>

          <aside
            id="default-sidebar"
            className="transition-transform -translate-x-full sm:translate-x-0 bg-gray-50 dark:bg-gray-800"
            style={{ width: '18rem' }}
            aria-label="Sidebar"
          >
            <div className="px-3 py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {' '}
                      <path stroke="none" d="M0 0h24v24H0z" />{' '}
                      <polyline points="5 12 3 12 12 3 21 12 19 12" />{' '}
                      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />{' '}
                      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                    </svg>
                    <span className="ms-3">Home</span>
                  </Link>
                </li>

                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        to={USER_PROFILE_PATH(currentUserProfile.username)}
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <svg
                          className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Profile
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link
                    to={USERS_PATH}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {' '}
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{' '}
                      <circle cx="9" cy="7" r="4" />{' '}
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />{' '}
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/teams"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">Teams</span>
                  </Link>
                </li>

                {!loading && (
                  <>
                    <li>
                      <Link
                        to="/chat"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <svg
                          className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>

                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Chat
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/conversations"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                      >
                        <svg
                          className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="1"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {' '}
                          <path stroke="none" d="M0 0h24v24H0z" />{' '}
                          <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />{' '}
                          <line x1="12" y1="11" x2="12" y2="11.01" />{' '}
                          <line x1="8" y1="11" x2="8" y2="11.01" />{' '}
                          <line x1="16" y1="11" x2="16" y2="11.01" />
                        </svg>

                        <span className="flex-1 ms-3 whitespace-nowrap">
                          Conversations
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                {!isAuthenticated && (
                  <li>
                    <Link
                      to="/signin"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{' '}
                        <path d="M7 12h14l-3 -3m0 6l3 -3" />
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        Sign In
                      </span>
                    </Link>
                  </li>
                )}

                {!isAuthenticated && (
                  <li>
                    <Link
                      to="/signup"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>

                      <span className="flex-1 ms-3 whitespace-nowrap">
                        Sign Up
                      </span>
                    </Link>
                  </li>
                )}

                {isAuthenticated && (
                  <li>
                    <Link
                      to="/"
                      onClick={signOutHandler}
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{' '}
                        <path d="M20 12h-13l3 -3m0 6l-3 -3" />
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        Logout
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <div className="flex-1 flex flex-col dark:border-gray-500">
            <Navbar />
            <Outlet />
          </div>
        </>
      )}
    </>
  );
}
