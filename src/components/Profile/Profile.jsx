import { Link } from "react-router-dom"; // Import Link from react-router-dom
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import ImageWithLoading from "../helper/ImageWithLoading";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function Profile() {
  const { user } = useFirebaseAuth();
  const {
    email,
    firstName,
    lastName,
    username,
    phone,
    profilePictureURL,
    profileLoading,
  } = useUserProfile(user);

  return (
    <>
      {profileLoading}
      {!profileLoading && (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4"></div>

          <div className="flex flex-col items-center pb-10">
            <ImageWithLoading
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={profilePictureURL || "/src/assets/empty_profile_pic.webp"}
              alt="Some image"
              width="6rem"
              height="6rem"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {firstName} {lastName}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Username: {username}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Email: {email}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Phone: {phone}
            </span>
            <div className="flex mt-4 md:mt-6">
              <Link
                to="edit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Edit
              </Link>
              <Link
                to="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 ms-3"
              >
                Message
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
