import { getAuth, type User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { writable } from 'svelte/store';

const firebaseConfig = {
	apiKey: 'AIzaSyDHKtaVzfCdc3xXaibiGmERLJ_JI6Srq-c',
	authDomain: 'habit-tracker-50a9c.firebaseapp.com',
	projectId: 'habit-tracker-50a9c',
	storageBucket: 'habit-tracker-50a9c.appspot.com',
	messagingSenderId: '572563891763',
	appId: '1:572563891763:web:7f2769d7d9efa0ca012546'
};
initializeApp(firebaseConfig);

export const currentUser = writable<User | null>();
// Not sure if this is the right  approach
export const authPending = writable<boolean>(true);

const auth = getAuth();

auth.onAuthStateChanged((user) => {
	currentUser.set(user);
});
