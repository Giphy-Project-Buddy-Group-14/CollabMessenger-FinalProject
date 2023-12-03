import React, { useEffect, useState } from 'react';
import { getTeamMembers } from '../../services/teams.service';
import { getUserProfileByUID } from '../../services/user.service';

const TeamMembers = ({ teamId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamMembersData = await getTeamMembers(teamId);
        const teamMembersWithUserInfo = await Promise.all(
          teamMembersData.map(async (memberId) => {
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
  }, [teamId]);
  const handleAddMembers = () => {
    console.log('Add Members button clicked!');
  };

  return (
    <div className="flex flex-col space-y-1 mt-4 -mx-2">
      <div className="flex flex-row items-center justify-between text-s mt-6">
        <span className="font-bold">Team members</span>
        <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
          {teamMembers.length}
        </span>
      </div>
      <div className="flex flex-col space-y-1 mt-4 -mx-2">
        {teamMembers.map((member) => (
          <div key={member.userInfo.uid} className="mb-2">
            <div className="flex items-center">
              <div className="relative">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={member.userInfo.profilePictureURL}
                />
                <div className="absolute inset-0 rounded-full shadow-inner"></div>
              </div>
              <div className="ml-4">
                <h2 className="font-bold text-gray-800 text-lg">
                  {member.userInfo.firstName} {member.userInfo.lastName}
                </h2>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <button className="p-1 text-blue-500 focus:outline-none flex items-center" onClick={handleAddMembers}>
            <svg
              className="h-8 w-8"
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
            <p className="text-gray-500 mr-2"> add member</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
