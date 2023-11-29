import PropTypes from 'prop-types';
import ImageWithLoading from '../helper/ImageWithLoading';
import Button from '../Ui/Button';

export default function UsersList({ users }) {
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-4xl text-center mt-4 mb-4">Users</h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Profile picture
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
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
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.createdOn}</td>
                <td className="px-6 py-4">
                  <Button title="Message" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
};
