import { PropTypes } from 'prop-types';
import { formatDateAsMonthDayYear } from '../../helper/dateHelper';
import ImageWithLoading from '../../helper/ImageWithLoading';
import {
  Dropdown,
  DropdownButton,
  DropdownItems,
  DropdownItem,
} from '../../Ui/Dropdown/Dropdown';
import useMessage from '../../../hooks/useMessage';
import { toast } from 'react-toastify';

export default function Message({ userProfile, message, conversationId }) {
  const { deleteMessage, author, loading } = useMessage();

  const deleteMessageHandler = async () => {
    try {
      await deleteMessage(conversationId, message);
      toast.success('Successfully deleted message!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  const authorized = () => message.authorId === author.id;

  return (
    <article className="px-6 py-4 text-base bg-white rounded-lg dark:bg-gray-900">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <ImageWithLoading
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={userProfile?.profilePictureURL}
            alt={userProfile?.displayName}
            width="2rem"
            height="2rem"
          />
          <p className="inline-flex items-center ml-3 mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            {userProfile?.displayName}:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2022-02-08" title="February 8th, 2022">
              {formatDateAsMonthDayYear(message.createdAt)}
            </time>
          </p>
        </div>
        {!loading && authorized() && (
          <Dropdown>
            <DropdownButton className="relative flex items-center justify-center rounded-full bg-white text-sm focus:outline-none focus:ring-0 hover:bg-gray-100 p-2">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
              <span className="sr-only">Message settings</span>
            </DropdownButton>
            <DropdownItems>
              <DropdownItem
                title="Delete Message"
                onClick={deleteMessageHandler}
              />
            </DropdownItems>
          </Dropdown>
        )}
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{message.text}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
        >
          <svg
            className="mr-1.5 w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          Reply
        </button>
      </div>
    </article>
  );
}

Message.propTypes = {
  userProfile: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
};
