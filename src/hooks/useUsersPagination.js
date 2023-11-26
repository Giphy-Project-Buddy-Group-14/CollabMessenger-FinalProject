import { useState, useEffect } from "react";

import {
  fetchTotalUserCount,
  fetchUsersWithPagination,
} from "../services/user.service";

import { DEFAULT_TIME_ZONE } from "../common/constants";
import moment from "moment-timezone";

export default function useUsersPagination(usersPerPage = 5) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatUsers = (users) => {
    return users.slice(0, usersPerPage).map((user) => ({
      ...user,
      createdOn: user?.createdOn
        ? moment(user.createdOn)
            .tz(DEFAULT_TIME_ZONE)
            .format("MMM Do YYYY, h:mm:ss A")
        : "",
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (users) {
        try {
          setLoading(true);

          const userCount = await fetchTotalUserCount();
          setTotalUsersCount(userCount);

          const fetchedUsers = await fetchUsersWithPagination(
            currentPage,
            usersPerPage
          );
          const usersList = formatUsers(fetchedUsers);
          setUsers(usersList);
        } catch (error) {
          console.error("Error: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [currentPage, usersPerPage]);

  return {
    users,
    totalUsersCount,
    currentPage,
    maxPage,
    next,
    previous,
    jump,
    loading,
  };
}
