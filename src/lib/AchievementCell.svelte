<script lang="ts">
	import type Achievement from '$lib/types/achievement';
	import type Habit from '$lib/types/habit';
	import IconButton from '@smui/icon-button';
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

	const collectionRef = collection(
		firestore,
		'users',
		$currentUser.uid,
		'habits',
		habit.id,
		'achievements'
	);

	const createAchievement = async () => {
		// WARNING: january is 0
		// TODO: Date could  be passed as prop
		const date = new Date(year, month, day);
		const time = Timestamp.fromDate(date);

		try {
			const newDoc = { time };
			await addDoc(collectionRef, newDoc);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};

	const deleteAchievement = async () => {
		if (!achievement || !achievement.id) return;
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
	class="achievement"
	class:achieved={!!achievement}
	on:click={() => {
		achievementClicked();
	}}
/>

<style>
	.achievement {
		border: 1px solid #dddddd;
		border-radius: 0.5rem;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
	}

	.achievement.achieved {
		background-color: mediumseagreen;
	}
</style>
