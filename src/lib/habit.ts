export default interface Habit {
	id: string;
	title: string;
	description: string;
	category?: string;
	color?: string;
	achievements: any[];
}
