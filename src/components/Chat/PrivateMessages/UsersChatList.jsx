import PropTypes from 'prop-types';
import UserChatItem from './UserChatItem';
import { useState } from 'react';
import useLoadUserProfiles from '../../../hooks/useLoadUserProfiles';
import LoadingIndicator from '../../Ui/LoadingIndicator';
import Heading from '../../Ui/Heading';

export default function UsersChatList({ onSelectUser }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const { userProfiles: users, loading } = useLoadUserProfiles();

  const clickHandler = (user) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <Heading title="Private Messages" />
          <div className="h-full px-2 pt-2 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              {users.map((user) => (
                <UserChatItem
                  key={user.uid}
                  user={user}
                  onClick={() => clickHandler(user)}
                  isSelected={selectedUser?.uid === user.uid}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

UsersChatList.propTypes = {
  onSelectUser: PropTypes.func.isRequired,
};
