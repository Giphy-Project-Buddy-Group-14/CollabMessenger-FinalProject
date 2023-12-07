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
    <div className="flex flex-col space-y-1 mt-2 -mx-2">
      <div className="flex flex-row items-center justify-between text-s mt-6">
        <span className="font-bold text-xs mb-2">Team members</span>
        <span className="flex items-center justify-center bg-gray-300 w-4 h-4 text-xs rounded-full ml-4">
          {teamMembers.length}
        </span>
      </div>
      <div className="flex flex-col space-y-1 mt-4">
        {teamMembers.map((member) => (
          <div key={member.userInfo.uid} className="mb-2">
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
                    className="cursor-pointer bg-gray-300 h-4 w-4 text-xs flex justify-center items-center rounded-full"
                    onClick={() => onRemoveUserFromTeam(member)}
                  >
                    x
                  </div>
                )}
              {member.userInfo.uid === loggedUser.uid && (
                <div
                  onClick={() => onLeaveTeam(member)}
                >
                  <svg
                    className="cursor-pointer h-4 w-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAddMembersFormVisible && (
          <div className="flex flex-col mt-4">
            <div className="mt-8">
              <h3 className="text-xs font-bold">Add members</h3>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a user"
                className="mt-2 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
              />
              {/* Cancel button */}
              <button
                className="mt-2 px-3 py-1 rounded-md text-xs bg-slate-500 text-white focus:outline-none flex items-center"
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
                  <div className="text-xs mt-4">SELECT A USER:</div>
                  <ul className="bg-white">
                    {filteredUsers.map((user, index) => (
                      <li key={index} className="py-2 flex text-xs">
                        <div
                          onClick={() => onSelectUserToAdd(user)}
                          className="hover:text-teal-500 cursor-pointer"
                        >
                          <b>{user.username}</b> ({user.email})
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
                className="h-3 w-3"
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
              <p className="text-gray-500 ml-1 text-xs">Add member</p>
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
