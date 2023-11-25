import ImageWithLoading from "../helper/ImageWithLoading";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUsersWithPagination } from "../../services/user.service";
import {
  DEFAULT_FETCH_USERS_LIMIT,
  DEFAULT_TIME_ZONE,
} from "../../common/constants";
import LoadingIndicator from "../Ui/LoadingIndicator";
import Pagination from "../Pagination/Pagination";
import { usersRef, fetchTotalUserCount } from "../../services/user.service";
import { off } from "firebase/database";
import moment from "moment-timezone";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_FETCH_USERS_LIMIT);

  useEffect(() => {
    fetchData();
    return () => {
      off(usersRef);
    };
  }, [itemsPerPage, currentPage]);

  const sortItems = (items) => {
    return items
      .slice(0, itemsPerPage)
      .sort((a, b) => b.createdOn - a.createdOn)
      .map((item) => ({
        ...item,
        createdOn: item?.createdOn
          ? moment(item.createdOn)
              .tz(DEFAULT_TIME_ZONE)
              .format("MMM Do YYYY, h:mm:ss A")
          : "",
      }));
  };

  async function fetchData() {
    try {
      setLoading(true);
      const userCount = await fetchTotalUserCount();
      setTotalItems(userCount);

      const items = await fetchUsersWithPagination(currentPage, itemsPerPage);

      const sortedItems = sortItems(items);
      setUsers(sortedItems);
    } catch (error) {
      console.log("fetchData error: ", error);
    } finally {
      setLoading(false);
    }
  }

  const nextPageHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const previousPageHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const perPageHandler = (perPage) => {
    setItemsPerPage(Number(perPage));
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
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
                  Created At
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
                      ? "even:bg-gray-50 even:dark:bg-gray-800"
                      : "odd:bg-white odd:dark:bg-gray-900"
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
                  <td className="px-6 py-4">{user.createdOn}</td>
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
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPreviousPageClick={previousPageHandler}
            onNextPageClick={nextPageHandler}
            onPerPageClick={perPageHandler}
          />
        </div>
      )}
    </>
  );
}
