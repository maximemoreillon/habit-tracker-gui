import type { Timestamp } from 'firebase/firestore';

interface Habit {
	id: string;
	time: Timestamp;
}

export default Habit;
