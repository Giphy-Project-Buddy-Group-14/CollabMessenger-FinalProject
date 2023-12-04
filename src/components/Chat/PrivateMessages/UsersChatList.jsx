import PropTypes from 'prop-types';
import UserChatItem from './UserChatItem';
import { useState } from 'react';

export default function UsersChatList({ users, onSelectUser }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const clickHandler = (user) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  return (
    <>
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
  );
}

UsersChatList.propTypes = {
  users: PropTypes.array.isRequired,
  onSelectUser: PropTypes.func.isRequired,
};
