<script lang="ts">
	import type Habit from '$lib/types/habit';
	import type Achievement from '$lib/types/achievement';
	import { Timestamp } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import { currentUser } from '$lib/firebase';
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

	import AchievementCell from './AchievementCell.svelte';

	export let habit: Habit;
	export let month: number;
	export let year: number;

	let unsub: Unsubscribe;
	let achievementsMap: Map<number, Achievement>;

	const firestore = getFirestore();

	onDestroy(() => {
		if (unsub) unsub();
	});

	// Watch changes
	$: month, subscribeToData();
	$: year, subscribeToData();
	$: habit, subscribeToData();

	// Dirty
	// TODO: reuse from parent
	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	const collectionRef = collection(
		firestore,
		'users',
		$currentUser.uid,
		'habits',
		habit.id,
		'achievements'
	);

	const subscribeToData = () => {
		if (unsub) unsub();

		// WARNING: january is 0
		const startDate = new Date(year, month, 1);
		const startTime = Timestamp.fromDate(startDate);
		const endDate = new Date(year, month, 1);
		endDate.setMonth(endDate.getMonth() + 1);
		const endTime = Timestamp.fromDate(endDate);

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
</script>

<tr>
	<td>
		<a href={`/habits/${habit.id}`}>{habit.title}</a>
	</td>
	{#if achievementsMap}
		{#each monthDays as day}
			<td>
				<AchievementCell {year} {month} {day} achievement={achievementsMap.get(day)} {habit} />
			</td>
		{/each}
	{/if}
</tr>

<style>
	td:first-child {
		padding-right: 1rem;
		white-space: nowrap;
	}
	td:not(:first-child) {
		text-align: center;
	}
</style>
