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

  const conversationImage = (participants) => {
    return (
      <div className="flex w-8 h-8 overflow-clip rounded-full">
        {participants.map((participant, index) => {
          return (
            <ImageWithLoading
              key={index}
              className="w-8 h-8"
              src={participant.profilePictureURL}
              alt={participant.displayName}
              width="2rem"
              height="2rem"
            />
          );
        })}
      </div>
    );
  };

  const formatConversationName = (participants) => {
    if (participants.length === 1) {
      const participant = participants[0];

      return (
        <div className="flex items-center gap-2">
          {conversationImage(participants)}
          <div>
            {participant.firstName} {participant.lastName}
          </div>
        </div>
      );
    }

    const restCount = participants.length - 2;

    if (participants.length > 1) {
      return (
        <div className="flex items-center gap-2">
          {conversationImage(participants)}
          <div>
            {participants[0].firstName}, {participants[1].firstName}
            {restCount ? (
              <span className="text-gray-400 ml-2">+{restCount}</span>
            ) : null}
          </div>
        </div>
      );
    }

    return '';
  };

  return (
    <>
      <li>
        <Link
          to={CONVERSATION_PATH(conversation.id)}
          className={`flex flex-col p-2 text-gray-900 rounded-lg border text-sm border-transparent dark:text-white ${
            isSelected
              ? 'bg-gray-100 border-blue-500 ring-blue-500'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          } group`}
        >
          {formatConversationName(otherParticipants)}
        </Link>
      </li>
    </>
  );
}

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
