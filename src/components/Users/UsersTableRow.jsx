import PropTypes from 'prop-types';
import ImageWithLoading from '../helper/ImageWithLoading';
import Button from '../Ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import useConversation from '../../hooks/useConversation';
import { useEffect, useCallback } from 'react';
import { CONVERSATION_PATH, USER_PROFILE_PATH } from '../../common/routes';

export function UsersTableRow({ userProfile, onCheckboxChange }) {
  const navigate = useNavigate();

  const { conversationId, addParticipant } = useConversation();

  const handleCheckboxChange = useCallback(
    (event) => {
      onCheckboxChange(userProfile, event.target.checked);
    },
    [userProfile, onCheckboxChange]
  );

  const sendMessageHandler = useCallback(() => {
    addParticipant(userProfile);
  }, [userProfile, addParticipant]);

  useEffect(() => {
    if (conversationId) {
      navigate(CONVERSATION_PATH(conversationId));
    }
  }, [conversationId, navigate]);

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id={`checkbox-${userProfile.id}`}
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={handleCheckboxChange}
          />
          <label htmlFor={`checkbox-${userProfile.id}`} className="sr-only">
            checkbox
          </label>
        </div>
      </td>
      <th
        scope="row"
        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <ImageWithLoading
          className="w-24 h-24 rounded-full shadow-lg"
          src={userProfile.profilePictureURL}
          alt={userProfile.displayName}
          width="2rem"
          height="2rem"
        />
        <div className="ps-3">
          <div className="text-base font-semibold">
            <Link to={USER_PROFILE_PATH(userProfile.username)}>
              {userProfile.displayName}
            </Link>
          </div>
          <div className="font-normal text-gray-500">{userProfile.email}</div>
        </div>
      </th>
      <td className="px-6 py-4">{userProfile.username}</td>
      <td className="px-6 py-4">{userProfile.phone}</td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{' '}
          Online
        </div>
      </td>
      <td className="px-6 py-4">
        <Button title="Send Message" onClick={sendMessageHandler} />
      </td>
    </tr>
  );
}

UsersTableRow.propTypes = {
  userProfile: PropTypes.object.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};
