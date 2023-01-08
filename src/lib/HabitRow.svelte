<script lang="ts">
	import type Habit from '$lib/types/habit';
	import type Achievement from '$lib/types/achievement';
	import { Timestamp } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	import IconButton from '@smui/icon-button';
	import { Row, Cell } from '@smui/data-table';
	import {
		collection,
		getFirestore,
		doc,
		onSnapshot,
		addDoc,
		deleteDoc,
		query,
		where
	} from 'firebase/firestore';
	import type { Unsubscribe } from 'firebase/firestore';

	export let habit: Habit;
	export let month: number;
	export let year: number;

	let unsub: Unsubscribe;
	let achievementsMap: Map<number, Achievement>;

	const firestore = getFirestore();

	onDestroy(() => {
		if (unsub) unsub();
	});

	// Watch month and year changes
	$: month, subscribeToData();
	$: year, subscribeToData();

	// Dirty
	// TODO: reuse from parent
	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	const subscribeToData = () => {
		if (unsub) unsub();

		const startDate = new Date(year, month, 1);
		const startTime = Timestamp.fromDate(startDate);
		// TODO: find better way
		const endDate = new Date(year, month, 1);
		endDate.setMonth(endDate.getMonth() + 1);
		const endTime = Timestamp.fromDate(endDate);

		const collectionRef = collection(firestore, 'habits', habit.id, 'achievements');

		const q = query(collectionRef, where('time', '>=', startTime), where('time', '<', endTime));

		unsub = onSnapshot(q, (collection) => {
			achievementsMap = collection.docs.reduce((prev, doc) => {
				// Still not ideal because might want to have a view for weeks
				const achievement = doc.data();
				const day = achievement.time.toDate().getDate();

				prev.set(day, { id: doc.id, ...achievement });

				return prev;
			}, new Map());
		});
	};

	// TODO: have those two in a component
	const createAchievement = async (habit: Habit, day: number) => {
		// TODO: Find better way
		const date = new Date(year, month, day);
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

	const deleteAchievement = async (achievement: Achievement | undefined) => {
		if (!achievement || !achievement.id) return;
		try {
			const collectionRef = collection(firestore, 'habits', habit.id, 'achievements');
			const docRef = doc(collectionRef, achievement.id);
			await deleteDoc(docRef);
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};

	// TODO: update of habit (title, description)
</script>

<Row>
	<!-- TODO: allow editing of those -->
	<Cell>
		{habit.title}
	</Cell>
	<Cell>
		{habit.description}
	</Cell>
	{#if achievementsMap}
		<!-- TODO: Deal with months that have less than 31 days -->
		{#each monthDays as day}
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
