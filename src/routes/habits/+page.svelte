<script lang="ts">
	import type Habit from '$lib/types/habit';
	import { onDestroy } from 'svelte';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { currentUser } from '$lib/firebase';
	import HabitRow from '$lib/HabitRow.svelte';
	import type { Unsubscribe } from 'firebase/firestore';
	import NewHabitDialog from '$lib/NewHabitDialog.svelte';
	import { collection, getFirestore, onSnapshot, where, query } from 'firebase/firestore';

	let unsub: Unsubscribe;
	let habits: Habit[] = [];
	const firestore = getFirestore();

	currentUser.subscribe((user) => {
		if (!user) return;
		const collectionRef = collection(firestore, 'habits');
		const q = query(collectionRef, where('user_id', '==', user.uid));
		// TODO: check if data gets updated if another user updates his habits
		unsub = onSnapshot(q, (collection) => {
			// TODO: fix typescript typing
			habits = collection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		});
	});

	onDestroy(() => {
		if (unsub) unsub();
	});
</script>

<h2>Habits</h2>

{#if $currentUser}
	<p>
		<NewHabitDialog />
	</p>

	<DataTable>
		<Head>
			<Row>
				<Cell>Name</Cell>
				<Cell>Description</Cell>
				{#each [...Array(31).keys()].map((d) => d + 1) as day}
					<Cell>{day}</Cell>
				{/each}
			</Row>
		</Head>
		<Body>
			{#each habits as habit}
				<HabitRow {habit} />
			{/each}
		</Body>
	</DataTable>
{:else}
	<p>This content is only accessible to authenticated users</p>
{/if}
