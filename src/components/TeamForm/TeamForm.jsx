import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  addTeamMember,
  getUserProfileByUID,
  removeChannelMember,
  searchUsers,
} from '../../services/user.service';
import PropTypes from 'prop-types';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { getTeamsByUid } from '../../services/teams.service';
import { useNavigate } from 'react-router';
import InputSection from '../Ui/InputSection';

const TeamMembers = ({ teamId }) => {
  const { user: loggedUser } = useFirebaseAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [isAddMembersFormVisible, setIsAddMembersFormVisible] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [memberUUIDs, setMemberUUIDs] = useState([]);
  const [team, setTeam] = useState({});
  const navigate = useNavigate();

  const onSelectUserToAdd = (user) => {
    addTeamMember(teamId, user);
  };

  const onRemoveUserFromTeam = (user) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    removeChannelMember(teamId, user.userInfo);
  };

  const onLeaveTeam = (user) => {
    removeChannelMember(teamId, user.userInfo);
    navigate(`/teams/`);
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamMembersWithUserInfo = await Promise.all(
          memberUUIDs.map(async (memberId) => {
            try {
              const userInfo = await getUserProfileByUID(memberId);
              return { ...memberId, userInfo };
            } catch (error) {
              console.error(
                `Error fetching user profile for UID ${memberId}:`,
                error
              );
              return { ...memberId, userInfo: {} };
            }
          })
        );
        setTeamMembers(teamMembersWithUserInfo);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchTeamMembers();
  }, [memberUUIDs]);

  const handleAddMembers = () => {
    setIsAddMembersFormVisible(true);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      const team = await getTeamsByUid(teamId);
      setTeam(team);
    };

    fetchTeam();
  }, [teamId]);

  useEffect(() => {
    const dbSelectedChannelRef = ref(getDatabase(), 'teams/' + teamId + '/');

    const off = onValue(
      dbSelectedChannelRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const channelsObj = snapshot.val();
          setMemberUUIDs(Object.keys(channelsObj.members || []));
        }
      },
      (error) => {
        console.error('Error fetching profile: ', error);
      }
    );

    return off;
  }, [teamId]);

  useEffect(() => {
    // fetch users by search
    const getUsers = async () => {
      const foundUsers = await searchUsers(search);
      const filteredUsers = foundUsers.filter(
        (user) => !memberUUIDs.includes(user.uid)
      );

      setFilteredUsers(filteredUsers);
      return null;
    };

    if (search.length) {
      getUsers();
    } else {
      setFilteredUsers([]);
    }
  }, [memberUUIDs, search]);

  return (
    <div className="flex flex-col space-y-1 mt-2 mr-4 w-48">
      <div className="flex flex-row items-center justify-between text-s mb-4">
        <span className="font-bold text-sm">Team members</span>
        <span className="flex items-center justify-center bg-gray-300 w-4 h-4 text-xs rounded-full ml-4">
          {teamMembers.length}
        </span>
      </div>

      <div className="flex flex-col space-y-1 gap-2">
        {teamMembers.map((member) => (
          <div key={member.userInfo.uid}>
            <div className="flex items-center">
              <div className="relative">
                <img
                  className="h-8 w-8 mr-2 rounded-full object-cover"
                  src={member.userInfo.profilePictureURL}
                />
              </div>

              <div className="flex-1">
                <div className=" text-gray-800 text-sm">
                  {member.userInfo.firstName} {member.userInfo.lastName}
                  {member.userInfo.uid === team.owner && (
                    <span className="text-xs text-gray-500 ml-2">(owner)</span>
                  )}
                </div>
              </div>

              {team &&
                loggedUser &&
                loggedUser.uid === team.owner &&
                member.userInfo.uid !== loggedUser.uid && (
                  <div
                    className="cursor-pointer text-xs flex flex-col whitespace-nowrap opacity-25 hover:opacity-100 transition"
                    onClick={() => onRemoveUserFromTeam(member)}
                  >
                    ☒ delete
                  </div>
                )}

              {member.userInfo.uid === loggedUser.uid &&
                loggedUser.uid !== team.owner && (
                  <div
                    onClick={() => onLeaveTeam(member)}
                    className="flex flex-row text-xs gap-1 text-zinc-500 pl-4 cursor-pointer"
                  >
                    <svg
                      className="cursor-pointer h-4 w-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    leave
                  </div>
                )}
            </div>
          </div>
        ))}

        {isAddMembersFormVisible && (
          <div className="flex flex-col mt-4">
            <div className="mt-8">
              <div className="text-sm font-bold">Add members</div>

              <InputSection
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a user"
                type="text"
                value={search}
              />

              {/* Cancel button */}
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-full mt-2"
                onClick={() => setIsAddMembersFormVisible(false)}
              >
                Close
              </button>

              {filteredUsers.length === 0 && search && (
                <div className="mt-4 text-xs">
                  No users found. Try searching for a different name.
                </div>
              )}

              {filteredUsers.length !== 0 && (
                <div>
                  <div className="text-xs mt-4">Select a user:</div>
                  <ul className="bg-white">
                    {filteredUsers.map((user, index) => (
                      <li key={index} className="py-2 flex text-sm">
                        <div
                          onClick={() => onSelectUserToAdd(user)}
                          className="hover:bg-slate-300 cursor-pointer block rounded-full px-4 py-2 bg-slate-100"
                        >
                          <div>{user.username}</div>
                          <div className="text-xs">{user.email}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {!isAddMembersFormVisible && (
          <div className="flex items-center mt-4">
            <button
              className="mt-8 text-blue-500 focus:outline-none flex items-center"
              onClick={handleAddMembers}
            >
              <svg
                className="h-4 w-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
              <p className="text-gray-500 ml-1 text-sm">Add member</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

TeamMembers.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default TeamMembers;
