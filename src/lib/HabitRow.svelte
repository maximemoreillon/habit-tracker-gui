<script lang="ts">
	import type Habit from '$lib/habit';
	import type Achievement from '$lib/achievement';
	import type { Unsubscribe } from 'firebase/firestore';
	import { Timestamp } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import { currentUser } from '$lib/firebase';
	import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

	import AchievementCell from './AchievementButton.svelte';

	export let habit: Habit;
	export let month: number;
	export let year: number;
	export let hideHabitName: boolean = false;

	let unsub: Unsubscribe;

	let achievementsMap: Map<number, Achievement>;

	const firestore = getFirestore();

	onDestroy(() => {
		if (unsub) unsub();
	});

	// Watch changes
	$: month, subscribeToData();
	$: year, subscribeToData();

	// Dirty
	// TODO: find way to reuse
	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	const dayIsCurrent = (day: number) =>
		new Date(year, month, day).toDateString() === new Date().toDateString();

	const dayIsPast = (day: number) => new Date(year, month, day + 1) < new Date();

	const subscribeToData = () => {
		if (!$currentUser) return;
		if (unsub) unsub();

		// WARNING: january is 0
		const startDate = new Date(year, month, 1);
		const startTime = Timestamp.fromDate(startDate);
		const endDate = new Date(year, month, 1);
		endDate.setMonth(endDate.getMonth() + 1);
		const endTime = Timestamp.fromDate(endDate);

		const collectionRef = collection(
			firestore,
			'users',
			$currentUser.uid,
			'habits',
			habit.id,
			'achievements'
		);

		const q = query(collectionRef, where('time', '>=', startTime), where('time', '<', endTime));

		unsub = onSnapshot(q, (collection) => {
			achievementsMap = collection.docs.reduce((prev, doc) => {
				// TODO: find way to deal with week view
				const achievement = doc.data();
				const day = achievement.time.toDate().getDate();

				prev.set(day, { id: doc.id, ...achievement });

				return prev;
			}, new Map());
		});
	};
</script>

<tr>
	{#if !hideHabitName}
		<td class="habit">
			<a href={`/habits/${habit.id}`}>{habit.title}</a>
		</td>
	{/if}
	{#if achievementsMap}
		{#each monthDays as day}
			<td class="achievement" class:current={dayIsCurrent(day)} class:past={dayIsPast(day)}>
				<AchievementCell {year} {month} {day} achievement={achievementsMap.get(day)} {habit} />
			</td>
		{/each}
	{/if}
</tr>

<style>
	.habit {
		padding-inline: 0.5rem;
		white-space: nowrap;
		background-color: white;
		/* 
		font-weight: bold;
		color: inherit;
		text-decoration: none;
		 */
	}

	.achievement {
		line-height: 0;
		padding: 0.25rem;
		text-align: center;
	}
</style>
