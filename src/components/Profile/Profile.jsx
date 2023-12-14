import { Link, useParams } from 'react-router-dom'; // Import Link from react-router-dom
import ImageWithLoading from '../helper/ImageWithLoading';
import LoadingIndicator from '../Ui/LoadingIndicator';
import useLoadUserProfileByUsername from '../../hooks/useLoadUserProfileByUsername';
import { useAuth } from '../../hooks/useAuth';
export default function Profile() {
  const params = useParams();
  const username = params.username;
  const { loading, userProfile } = useLoadUserProfileByUsername(username);
  const { currentUserProfile } = useAuth();

  return (
    <>
      {loading && <LoadingIndicator />}

      {!loading && (
        <div className="bg-white p-6 page-with-bg flex-1">
          <div className="h-18">
            <div className="text-m font-bold pb-6">Profile</div>
          </div>

          <div className="flex flex-row gap-6 bg-slate-50 whitespace-nowrap p-6 bg-opacity-80 rounded-2xl">
            <div className="pb-4">
              <ImageWithLoading
                className="w-24 h-24 rounded-full"
                src={
                  userProfile?.profilePictureURL ||
                  '/src/assets/empty_profile_pic.webp'
                }
                alt="Some image"
                width="12rem"
                height="12rem"
              />

              <div className="p-6">
                <div className="text-xl font-bold">
                  {userProfile.firstName} {userProfile.lastName}
                </div>
                <div>@{userProfile.username}</div>
                <div className="flex gap-2 flex-col mt-6">
                  <div>Email: {userProfile.email}</div>
                  <div>Phone: {userProfile.phone}</div>
                </div>
                {username === currentUserProfile.username && (
                  <div className="flex mt-4 md:mt-6">
                    <Link
                      to="edit"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Edit Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-m font-bold">My Teams</div>

              <ul>
                {Object.keys(currentUserProfile.MyTeams).map((teamName) => (
                  <li
                    className="p-2 px-4 flex gap-2 bg-slate-50 mb-2 rounded-full bg-opacity-60 border pr-8"
                    key={teamName}
                  >
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    <div>{teamName}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
