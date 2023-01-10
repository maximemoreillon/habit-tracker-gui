<script lang="ts">
	import type Habit from '$lib/types/habit';
	import type { Unsubscribe } from 'firebase/firestore';

	import { currentUser } from '$lib/firebase';
	import { onDestroy } from 'svelte';
	import { collection, getFirestore, onSnapshot, where, query } from 'firebase/firestore';

	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	import HabitRow from '$lib/HabitRow.svelte';
	import NewHabitDialog from '$lib/NewHabitDialog.svelte';

	const firestore = getFirestore();

	let unsub: Unsubscribe;
	let habits: Habit[] = [];
	let month = new Date().getMonth();
	let year = new Date().getFullYear();

	// Dirty
	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	currentUser.subscribe((user) => {
		if (!user) return;
		const collectionRef = collection(firestore, 'users', user.uid, 'habits');
		// TODO: check if data gets updated if another user updates his habits
		unsub = onSnapshot(collectionRef, (collection) => {
			// TODO: fix typescript typing
			habits = collection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		});
	});

	onDestroy(() => {
		if (unsub) unsub();
	});

	// TODO: take month and year into account
	const dayIsCurrentDay = (day: number) =>
		new Date(year, month, day).toDateString() === new Date().toDateString();
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
	<!-- TODO: consider using a normal <table> so as to have more control over padding and margins -->
	<!-- Grid can probably not be used because number of column depends on number of days -->
	<table>
		<thead>
			<tr>
				<th />
				{#each monthDays as day}
					<th>
						<span class:current={dayIsCurrentDay(day)} class="day">
							{day}
						</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each habits as habit}
				<HabitRow {habit} {month} {year} />
			{/each}
		</tbody>
	</table>
{:else}
	<p>This content is only accessible to authenticated users</p>
{/if}

<style>
	.day {
		display: flex;
		justify-content: center;
		border-radius: 0.5em;
	}
	.current {
		background-color: orange;
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	/* TODO: past and future days */
</style>
