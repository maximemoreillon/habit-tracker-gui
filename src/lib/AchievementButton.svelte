<script lang="ts">
	import type Achievement from '$lib/achievement';
	import type Habit from '$lib/habit';
	import { Timestamp } from 'firebase/firestore';
	import { currentUser } from '$lib/firebase';
	import { collection, getFirestore, doc, addDoc, deleteDoc } from 'firebase/firestore';

	export let achievement: Achievement | undefined;
	export let habit: Habit;

	// TODO: consider passing a date directly
	export let year: number;
	export let month: number;
	export let day: number;

	const firestore = getFirestore();

	const dayIsPast = () => new Date(year, month, day + 1) < new Date();

	const createAchievement = async () => {
		if (!$currentUser) return;
		// WARNING: january is 0
		const date = new Date(year, month, day);
		const time = Timestamp.fromDate(date);

		const collectionRef = collection(
			firestore,
			'users',
			$currentUser.uid,
			'habits',
			habit.id,
			'achievements'
		);

		try {
			const newDoc = { time };
			await addDoc(collectionRef, newDoc);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};

	const deleteAchievement = async () => {
		if (!achievement?.id) return;
		if (!$currentUser) return;

		const collectionRef = collection(
			firestore,
			'users',
			$currentUser.uid,
			'habits',
			habit.id,
			'achievements'
		);

		try {
			const docRef = doc(collectionRef, achievement.id);
			await deleteDoc(docRef);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};

	const achievementClicked = () => {
		if (achievement) deleteAchievement();
		else createAchievement();
	};
</script>

<button
	style="background-color: {!!achievement ? habit.color || '#c00000' : 'white'}"
	class="achievement"
	class:past={dayIsPast()}
	on:click={() => {
		achievementClicked();
	}}
/>

<style>
	.achievement {
		border: 1px solid #bbbbbb;
		border-radius: 0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		margin: 0;
	}
</style>
