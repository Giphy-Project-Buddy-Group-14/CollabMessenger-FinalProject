import Button from '../Ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeamsByUserUids } from '../../services/teams.service';
import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

export default function Teams() {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const { MyTeams } = useUserProfile();
  const handleTeamClick = (team) => {
    navigate(`/teams/${team.uid}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (MyTeams) {
          const teamsData = await getTeamsByUserUids(Object.values(MyTeams));
          setTeams(teamsData);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, [MyTeams]);

  const newTeam = () => {
    navigate('/new-team');
  };

  return (
    <section className="bg-gray-100 py-8">
      <div className="container mx-auto text-center px-4 pl-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Teams</h2>

        <div className="flex justify-start items-center mb-4">
          <Button title="New team" onClick={newTeam} />
        </div>

        <div className="flex flex-wrap -mx-4">
          {teams
            .filter((team) => {
              return team.members && team.members[user.uid];
            })
            .map((team) => (
              <div
                key={team.uid}
                className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8 hover:cursor-pointer"
                onClick={() => handleTeamClick(team)}
              >
                <div className="block p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 dark:border-gray-700 lg:mb-0">
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-400 mb-2">
                    {`${Object.keys(team.members || {}).length} member${Object.keys(team.members || {}).length !== 1 ? 's' : ''
                      } `}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {team.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
