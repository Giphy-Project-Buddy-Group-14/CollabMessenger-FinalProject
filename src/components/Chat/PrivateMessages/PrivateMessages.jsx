import { useState, useEffect } from 'react';
import { getAllUserProfiles } from '../../../services/user.service';
import UsersChatList from './UsersChatList';
import Split from 'react-split-grid';
import './Grid.css';
import PrivateMessageForm from './PrivateMessageForm';

export default function PrivateMessages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [columns, setColumns] = useState('1fr 1px 4fr');

  useEffect(() => {
    (async function () {
      try {
        const allUserProfiles = await getAllUserProfiles();
        setAllUsers(allUserProfiles);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleDrag = (direction, track, gridTemplateStyle) => {
    setColumns(gridTemplateStyle);
  };

  const onSelectUserHandler = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Split
        gridTemplateColumns={columns}
        onDrag={handleDrag}
        cursor="col-resize"
        render={({ getGridProps, getGutterProps }) => (
          <div className="split-grid" {...getGridProps()}>
            <div className="split-column">
              <div className="text-s">
                <h6 className="text-lg font-bold dark:text-white text-center pb-0 pt-4">
                  Private
                </h6>
                <UsersChatList
                  users={allUsers}
                  onSelectUser={onSelectUserHandler}
                />
              </div>
            </div>
            <div
              className="gutter gutter-vertical"
              {...getGutterProps('column', 1)}
            />
            <div className="split-column">
              <div className="flex flex-col flex-auto h-full p-6">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                  <div className="flex flex-col justify-end mt-auto">
                    <PrivateMessageForm user={selectedUser} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
}
