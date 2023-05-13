import type { Timestamp } from 'firebase/firestore';

export default interface Habit {
	id: string;
	time: Timestamp;
}
