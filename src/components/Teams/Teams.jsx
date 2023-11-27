import Button from '../Ui/Button';
import { useNavigate } from 'react-router-dom';
import {  getTeamsByUserUids } from '../../services/teams.service';
import { useState, useEffect } from 'react';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { useUserProfile } from '../../hooks/useUserProfile';



export default function Teams() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const { user } = useFirebaseAuth();
    const { MyTeams } = useUserProfile(user);


    const handleTeamClick = (teamId) => {
        console.log(`Team clicked: ${teamId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(MyTeams) {
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
        navigate('/new-team')
    }


    return (
        <section className="bg-gray-100 py-8">
            <div className="container mx-auto text-center px-4 pl-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Teams</h2>

                <div className="flex justify-start items-center mb-4">
                    <Button title="New team" onClick={newTeam} />
                </div>

                <div className="flex flex-wrap -mx-4">
                    {teams.map((team) => (
                        <div key={team.uid} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8" onClick={() => handleTeamClick(team.uid)}>
                            <div className="block p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 dark:border-gray-700 lg:mb-0">
                                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{team.name}</h3>
                                <p className="font-normal text-gray-700 dark:text-gray-400">{team.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}