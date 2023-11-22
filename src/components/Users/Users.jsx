import { Link } from 'react-router-dom';

const users = [
  {
    firstName: 'John',
    lastName: 'Smith',
    phone: '0890 12345678',
    createdOn: '1700604982986',
    username: 'johnsmith',
    uid: '6MGiJZ8KT7hrJXoEYyQpXLqa4942',
    email: 'johnsmith@gmai.com  ',
  },
  {
    firstName: 'Nick',
    lastName: 'Smith',
    phone: '0890 87654221',
    createdOn: '1700604982988',
    username: 'nicksmith',
    uid: 'JNtRQshQKsV5DGUvp3QHgjFwGfA3',
    email: 'nicksmith@gmai.com  ',
  },
];

export default function Users() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-4xl text-center mt-4 mb-4">Users</h1>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
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
                {user.username}
              </th>
              <td className="px-6 py-4">{user.firstName}</td>
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
    </div>
  );
}
