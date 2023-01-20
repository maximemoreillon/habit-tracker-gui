<script lang="ts">
	import type Habit from '$lib/habit';
	import type { Unsubscribe } from 'firebase/firestore';

	import { currentUser } from '$lib/firebase';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	import HabitRow from '$lib/HabitRow.svelte';
	import NewHabitDialog from '$lib/NewHabitDialog.svelte';
	import { onMount } from 'svelte';
	import type { User } from 'firebase/auth';

	const firestore = getFirestore();

	let unsub: Unsubscribe;
	let habits: Habit[] = [];
	let month = new Date().getMonth();
	let year = new Date().getFullYear();

	// Dirty
	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	// TODO: find better way
	onMount(() => {
		currentUser.subscribe((user) => {
			if (user === null) goto('/login');
			if (!user) return;
			subScribeToCollection(user);
		});
	});

	function subScribeToCollection(user: User) {
		const collectionRef = collection(firestore, 'users', user.uid, 'habits');
		// TODO: check if data gets updated if another user updates his habits
		unsub = onSnapshot(collectionRef, (collection) => {
			habits = collection.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Habit[];
		});
	}

	onDestroy(() => {
		if (unsub) unsub();
	});

	const dayIsCurrent = (day: number) =>
		new Date(year, month, day).toDateString() === new Date().toDateString();

	const dayIsPast = (day: number) => new Date(year, month, day + 1) < new Date();
</script>

<h2>Habits</h2>

<Textfield bind:value={year} label="Year" type="number" />
<Select bind:value={month} label="Month">
	{#each [...Array(12).keys()] as month}
		<!-- WARNING: January is 0 -->
		<Option value={month}>{month + 1}</Option>
	{/each}
</Select>

{#if $currentUser}
	<p>
		<NewHabitDialog />
	</p>

	<!-- TODO: consider vertical layout for smartphones -->
	<!-- Grid can probably not be used because number of column depends on number of days -->
	<div class="table_wrapper">
		<table>
			<thead>
				<tr>
					<th />
					{#each monthDays as day}
						<th class="day" class:current={dayIsCurrent(day)} class:past={dayIsPast(day)}>
							{day}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<!-- NOTE: using id as key -->
				{#each habits as habit (habit.id)}
					<HabitRow {habit} {month} {year} />
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p>This content is only accessible to authenticated users</p>
{/if}

<style>
	.table_wrapper {
		width: 100%;
		overflow-x: auto;
		position: relative;
	}
	table {
		border-collapse: collapse;
		min-width: 100%;
	}

	table :global(.current) {
		background-color: #ff3e00 !important;
		color: white;
	}

	table :global(thead .current) {
		border-radius: 0.5rem 0.5em 0 0;
	}

	table :global(tbody tr:last-child .current) {
		border-radius: 0 0 0.5rem 0.5rem;
	}

	table :global(.past) {
		/* background-color: #f7eae6; */
	}

	table :global(tr:hover td) {
		background-color: #ffe2d8;
	}

	table :global(:is(th, td):first-child) {
		position: sticky;
		left: 0;
		z-index: 2;
		background-color: white;
	}
</style>
