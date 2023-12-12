import { Link, useParams } from 'react-router-dom'; // Import Link from react-router-dom
import ImageWithLoading from '../helper/ImageWithLoading';
import LoadingIndicator from '../Ui/LoadingIndicator';
import useLoadUserProfileByUsername from '../../hooks/useLoadUserProfileByUsername';

export default function Profile() {
  const params = useParams();
  const username = params.username;
  const { loading, userProfile } = useLoadUserProfileByUsername(username);

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4"></div>

          <div className="flex flex-col items-center pb-10">
            <ImageWithLoading
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={
                userProfile.profilePictureURL ||
                '/src/assets/empty_profile_pic.webp'
              }
              alt="Some image"
              width="12rem"
              height="12rem"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {userProfile.firstName} {userProfile.lastName}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Username: {userProfile.username}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Email: {userProfile.email}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Phone: {userProfile.phone}
            </span>
            <div className="flex mt-4 md:mt-6">
              <Link
                to="edit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
