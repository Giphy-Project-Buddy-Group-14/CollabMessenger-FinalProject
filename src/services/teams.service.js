import { get, set, ref, update, push, child } from 'firebase/database';
import { db } from '../../firebaseAppConfig';

export const addTeam = async (username, name) => {
    try {
        const result = await push(ref(db, 'teams'), {});
        const uid = result.key;
        const owner = username;
        const channels = {};
        const members = {};
        members[username] = true;

        await set(ref(db, `teams/${name}`), { name, owner, members, channels, uid });
        await update(ref(db), {[`users/${username}/MyTeams/${name}`]: uid});

    } catch (error) {
        console.error("Error adding team:", error);
        throw error;
    }
};

export const checkIfTeamNameExists = async (name) => {
    try {
        const teamRef = ref(db, "teams");
        const snapshot = await get(child(teamRef, name));
        return snapshot.exists();
    } catch (error) {
        console.error("Error checking if  team name exists:", error.message);
        throw new Error("Error checking if team name exists");
    }
}