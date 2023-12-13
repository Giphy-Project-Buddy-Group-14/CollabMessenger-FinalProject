import PropTypes from 'prop-types';
import ImageWithLoading from '../helper/ImageWithLoading';
import { Link } from 'react-router-dom';
import { CONVERSATION_PATH } from '../../common/routes';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export default function ConversationItem({ conversation, isSelected }) {
  const [otherParticipants, setOtherParticipants] = useState([]);
  const { currentUserProfile } = useAuth();

  useEffect(() => {
    if (!currentUserProfile) {
      return;
    }

    const otherParticipants = conversation.participants.filter(
      (participant) => participant.id !== currentUserProfile.id
    );

    setOtherParticipants(otherParticipants);
  }, [conversation.participants, currentUserProfile]);

  return (
    <>
      <li>
        <Link
          to={CONVERSATION_PATH(conversation.id)}
          className={`flex flex-col p-2 text-gray-900 rounded-lg border border-transparent dark:text-white ${
            isSelected
              ? 'bg-gray-100 border-blue-500 ring-blue-500'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          } group`}
        >
          {otherParticipants.map((participant) => {
            return (
              <div
                key={participant.id}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <ImageWithLoading
                    className="w-8 h-8 rounded-full shadow-lg"
                    src={participant.profilePictureURL}
                    alt={participant.displayName}
                    width="2rem"
                    height="2rem"
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {participant.displayName}
                  </span>
                </div>
                {/* {index === 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {messagesCount}
                    </span>
                  )} */}
              </div>
            );
          })}
        </Link>
      </li>
    </>
  );
}

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
