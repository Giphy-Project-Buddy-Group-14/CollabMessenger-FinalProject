import { app } from './firebaseConfig';

import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage();
