import ImageWithLoading from '../helper/ImageWithLoading';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUsersWithPagination } from '../../services/user.service';
import { DEFAULT_FETCH_USERS_LIMIT } from '../../common/constants';
import LoadingIndicator from '../Ui/LoadingIndicator';
import Pagination from '../Pagination/Pagination';
import convertDate from '../helper/convertDate';
export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState(null);
  const [pageDirection, setPageDirection] = useState('next');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // const all = await fetchUsersWithPagination(10);
        // console.log('all --> ', all);

        console.log(
          'DEFAULT_FETCH_USERS_LIMIT --> ',
          DEFAULT_FETCH_USERS_LIMIT
        );
        // console.log('username --> ', username);

        const fetchedUsers = await fetchUsersWithPagination(
          DEFAULT_FETCH_USERS_LIMIT,
          username,
          pageDirection
        );
        console.log('fetchedUsers --> ', fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [username, pageDirection]);

  const firstUsername = () => users[0].username;
  const lastUsername = () => users[users.length - 1].username;

  const loadMoreUsers = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    console.log('lastUsername -->', lastUsername);
    setUsername(lastUsername);
  };

  const nextPageHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log('nextPageHandler --> ', pageNumber);
    console.log('lastUsername -->', lastUsername);
    setUsername(lastUsername);
    setPageDirection('next')
  };

  const previousPageHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log('onPreviousPageClick --> ', pageNumber);
    console.log('firstUsername -->', firstUsername);
    setUsername(firstUsername);
    setPageDirection('previous')
  };

  return (
    <>
      {isLoadingUsers && <LoadingIndicator />}
      {!isLoadingUsers && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h1 className="text-4xl text-center mt-4 mb-4">Users</h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Profile picture
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Created On
                </th>
                <th
                  scope="col"
                  className="px-6 py-3"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? 'even:bg-gray-50 even:dark:bg-gray-800'
                      : 'odd:bg-white odd:dark:bg-gray-900'
                  } border-b dark:border-gray-700`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray"
                  >
                    <ImageWithLoading
                      className="w-24 h-24 mb-3 rounded-full shadow-lg"
                      src={user.profilePictureURL}
                      alt="Some image"
                      width="2rem"
                      height="2rem"
                    />
                  </th>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.uid}</td>
                  <td className="px-6 py-4">{user.lastName}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{convertDate(user.createdOn)}</td>
                  <td className="px-6 py-4">
                    <Link
                      to="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoadingUsers ? (
            <p>Loading...</p>
          ) : (
            <button
              onClick={loadMoreUsers}
              disabled={isLoadingUsers}
            >
              Load More
            </button>
          )}
          <Pagination
            currentPage={currentPage}
            onPreviousPageClick={previousPageHandler}
            onNextPageClick={nextPageHandler}
          />
        </div>
      )}
    </>
  );
}
