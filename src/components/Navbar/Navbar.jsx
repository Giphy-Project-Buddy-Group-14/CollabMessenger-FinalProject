import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import ImageWithLoading from '../helper/ImageWithLoading';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks/useUserProfile';
import {
  Dropdown,
  DropdownButton,
  DropdownItems,
  DropdownItem,
} from '../Ui/Dropdown/Dropdown';

export default function Navbar() {
  const { logout } = useAuth();
  const { isAuthenticated } = useFirebaseAuth();
  const { profilePictureURL, profileLoading, ...userDetails } =
    useUserProfile();

  const navigate = useNavigate();

  const logoutNavbar = () => {
    logout();
    navigate('/signin');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 bg-opacity-25 backdrop-blur-lg">
      {({ open }) => (
        <>
          <div className="mx-auto mr-4 px-2">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"></div>
              {/* Profile dropdown */}
              {isAuthenticated && (
                <>
                  <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {!profileLoading && (
                      <div className="flex gap-2 items-center">
                        <Dropdown>
                          <DropdownButton
                            className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            id="user-menu-button"
                            aria-expanded="false"
                            data-dropdown-toggle="user-dropdown"
                            data-dropdown-placement="bottom"
                          >
                            <ImageWithLoading
                              className="w-24 h-24 mb-3 rounded-full shadow-lg"
                              src={profilePictureURL}
                              alt="Some image"
                              width="2rem"
                              height="2rem"
                            />
                          </DropdownButton>
                          <DropdownItems>
                            <DropdownItem to="/profile" title="Your Profile" />
                            <DropdownItem title="Settings" />
                            <DropdownItem
                              title="Logout"
                              onClick={logoutNavbar}
                            />
                          </DropdownItems>
                        </Dropdown>

                        <div className="flex text-slate-50 text-xs flex-col ml-2">
                          <b>
                            {userDetails.firstName} {userDetails.lastName}
                          </b>
                          <div className="opacity-80">{userDetails.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
