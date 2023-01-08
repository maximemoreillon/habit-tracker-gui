<script lang="ts">
	import type Habit from '$lib/types/habit';
	import type Achievement from '$lib/types/achievement';
	import { Timestamp } from 'firebase/firestore';
	import IconButton from '@smui/icon-button';
	import { onMount, onDestroy } from 'svelte';

	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import {
		collection,
		getDocs,
		getFirestore,
		doc,
		updateDoc,
		onSnapshot,
		addDoc,
		deleteDoc
	} from 'firebase/firestore';

	export let habit: Habit;

	let achievements = [];

	// TypeScript gets angry at this hash map
	let achievementsMap: Map<number, Achievement>;

	const firestore = getFirestore();

	onDestroy(() => {
		unsub();
	});

	const collectionRef = collection(firestore, 'habits', habit.id, 'achievements');

	const unsub = onSnapshot(collectionRef, (collection) => {
		achievementsMap = collection.docs.reduce((prev, doc) => {
			// Still not ideal because might want to have a view for weeks
			const achievement = doc.data();
			const day = achievement.time.toDate().getDate();

			prev.set(day, { id: doc.id, ...achievement });

			return prev;
		}, new Map());
	});

	const createAchievement = async (habit: Habit, day: number) => {
		// TODO: get month and year

		const date = new Date(`2023-01-${day}`);
		const time = Timestamp.fromDate(date);

		try {
			const collectionRef = collection(firestore, 'habits', habit.id, 'achievements');
			const newDoc = { time };
			await addDoc(collectionRef, newDoc);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};

	const deleteAchievement = async ({ id }) => {
		try {
			const collectionRef = collection(firestore, 'habits', habit.id, 'achievements');
			const docRef = doc(collectionRef, id);
			await deleteDoc(docRef);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};
</script>

<Row>
	<Cell>
		{habit.title}
	</Cell>
	<Cell>
		{habit.description}
	</Cell>
	{#if achievementsMap}
		<!-- TODO: Deal with months that have less than 31 days -->
		{#each [...Array(31).keys()].map((d) => d + 1) as day}
			{#if achievementsMap.get(day)}
				<Cell>
					<IconButton
						class="material-icons"
						on:click={() => deleteAchievement(achievementsMap.get(day))}>delete</IconButton
					>
				</Cell>
			{:else}
				<Cell>
					<IconButton class="material-icons" on:click={() => createAchievement(habit, day)}
						>add</IconButton
					>
				</Cell>
			{/if}
		{/each}
	{/if}
</Row>
