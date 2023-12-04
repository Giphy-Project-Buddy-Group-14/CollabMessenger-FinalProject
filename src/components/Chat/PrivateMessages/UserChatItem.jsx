import PropTypes from 'prop-types';
import ImageWithLoading from '../../helper/ImageWithLoading';
import { Link } from 'react-router-dom';

export default function UserChatItem({ user, onClick, isSelected }) {
  return (
    <>
      <li>
        <Link
          to="#"
          className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white ${
            isSelected
              ? 'bg-gray-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          } group`}
          onClick={onClick}
        >
          <ImageWithLoading
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={user.profilePictureURL}
            alt={user.displayName}
            width="2rem"
            height="2rem"
          />
          <span className="flex-1 ms-3 whitespace-nowrap">
            {user.displayName}
          </span>
          <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            3
          </span>
        </Link>
      </li>
    </>
  );
}

UserChatItem.propTypes = {
  user: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
