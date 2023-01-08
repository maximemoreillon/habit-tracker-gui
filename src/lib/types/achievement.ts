import type { Timestamp } from 'firebase/firestore';

type Habit = {
	id: string;
	time: Timestamp;
};

export default Habit;
