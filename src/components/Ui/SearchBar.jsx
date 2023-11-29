import PropTypes from 'prop-types';

export default function SearchBar({ allUsers, onSearch }) {
  console.log('allUsers -->', allUsers);

  function filterUsersBySearch(search) {
    return allUsers.filter((user) => {
      return (
        user.username.toLowerCase().startsWith(search) ||
        user.email.toLowerCase().startsWith(search) ||
        user.firstName.toLowerCase().startsWith(search) ||
        user.lastName.toLowerCase().startsWith(search) ||
        user.phone.toLowerCase().startsWith(search) ||
        (user.firstName + ' ' + user.lastName).toLowerCase().startsWith(search)
      );
    });
  }

  const inputSearchHandler = (event) => {
    const searchValue = event.target.value.toLowerCase();

    (async function () {
      try {
        const filteredUsers = filterUsersBySearch(searchValue);
        onSearch(filteredUsers, searchValue);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const searchHandler = (event) => {
    event.preventDefault();
    // history.pushState(`/search?name=${search}`);
  };

  return (
    <form className="flex items-center">
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>

      <div className="relative w-full">
        <input
          onChange={inputSearchHandler}
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search..."
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={searchHandler}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  allUsers: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
};
