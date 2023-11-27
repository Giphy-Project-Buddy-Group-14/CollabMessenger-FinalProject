import { get, set, ref, update, push } from 'firebase/database';
import { db } from '../../firebaseAppConfig';


export const addTeam = async (username, name) => {
    try {
        const result = await push(ref(db, 'teams'), {});
        const uid = result.key;
        const owner = username;
        const channels = {};
        const members = {};
        members[username] = true;

        await set(ref(db, `teams/${uid}`), { name, owner, members, channels, uid });
        await update(ref(db), { [`users/${username}/MyTeams/${name}`]: uid });

    } catch (error) {
        console.error('Error adding team:', error);
        throw error;
    }
};

export const checkIfTeamNameExists = async (name) => {
    try {
        const teamsRef = ref(db, 'teams');
        const snapshot = await get(teamsRef);

        if (snapshot.exists()) {
            const teamsData = snapshot.val();
            return Object.values(teamsData).some(team => team.name === name);
        }

        return false;
    } catch (error) {
        console.error('Error checking if team name exists:', error.message);
        throw new Error('Error checking if team name exists');
    }
}

export const getTeamsByUserUids = async (userUids) => {
    try {
        const snapshot = await get(ref(db, 'teams'));

        if (snapshot.exists()) {
            const teamsData = Object.values(snapshot.val()).filter(team => userUids.includes(team.uid));
            return teamsData;
        }

        return [];
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};

export const getAllTeams = async () => {
    try {
        const snapshot = await get(ref(db, 'teams'));

        if (!snapshot.exists()) {
            return [];
        }
        const teamsArray = Object.values(snapshot.val());

        return teamsArray;

    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};
