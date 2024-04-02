// This file connect to the firebase dabaase and export the connection to be used in other files.
import app from './firebase';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(app);

export default db;
