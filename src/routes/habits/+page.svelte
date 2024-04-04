<script lang="ts">
	import type Habit from '$lib/habit';
	import type { Unsubscribe } from 'firebase/firestore';

	import { currentUser } from '$lib/firebase';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

	import MonthSelector from '$lib/MonthSelector.svelte';
	import HabitsTable from '$lib/HabitsTable.svelte';
	import NewHabitDialog from '$lib/NewHabitDialog.svelte';
	import LinearProgress from '@smui/linear-progress';

	import { onMount } from 'svelte';
	import type { User } from 'firebase/auth';

	const firestore = getFirestore();

	let unsub: Unsubscribe;
	let habits: Habit[] = [];
	let month = new Date().getMonth();
	let year = new Date().getFullYear();

	let loading = false;

	// TODO: find better way
	onMount(() => {
		currentUser.subscribe((user) => {
			if (user === null) goto('/login');
			if (!user) return;
			subScribeToCollection(user);
		});
	});

	function subScribeToCollection(user: User) {
		loading = true;
		const collectionRef = collection(firestore, 'users', user.uid, 'habits');
		// TODO: check if data gets updated if another user updates his habits. Probably not though
		// NOTE: does not query subcollections?
		unsub = onSnapshot(collectionRef, (collection) => {
			habits = collection.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Habit[];
			loading = false;
		});
	}

	onDestroy(() => {
		if (unsub) unsub();
	});
</script>

<h2>My Habits</h2>

{#if $currentUser}
	<NewHabitDialog />

	{#if loading}
		<LinearProgress indeterminate />
	{:else}
		<div class="tools">
			<MonthSelector bind:month bind:year />
		</div>

		<!-- TODO: consider vertical layout for smartphones -->
		<!-- Grid can probably not be used because number of column depends on number of days -->
		<HabitsTable {habits} {month} {year} />
	{/if}
{:else}
	<p>This content is only accessible to authenticated users</p>
{/if}

<style>
	.tools {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
	}
</style>
