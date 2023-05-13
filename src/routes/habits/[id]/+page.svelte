<script lang="ts">
	import type Habit from '$lib/habit';

	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import Snackbar, { Actions, Label as SnackbarLabel } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';

	import HabitsTable from '$lib/HabitsTable.svelte';
	import MonthSelector from '$lib/MonthSelector.svelte';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/firebase';

	import { page } from '$app/stores';
	import { getFirestore, collection, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

	const firestore = getFirestore();

	let habit: Habit;
	let month = new Date().getMonth();
	let year = new Date().getFullYear();

	let snackbar: Snackbar;
	let snackbarMessage: string;

	const { id } = $page.params;

	// TODO: find better way
	onMount(() => {
		currentUser.subscribe((user) => {
			if (user === null) goto('/login');
			getHabit();
		});
	});

	async function getHabit() {
		if (!$currentUser) return;
		try {
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');

			const docRef = doc(collectionRef, id);
			const docSnap = await getDoc(docRef);
			// Adding id to be consistent with schema
			habit = { id, ...docSnap.data() } as Habit;
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}

	async function deleteHabit() {
		if (!$currentUser) return;
		if (!confirm('Delete habit?')) return;
		try {
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');

			const docRef = doc(collectionRef, id);
			await deleteDoc(docRef);
			goto('/habits');
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}

	async function updateHabit() {
		if (!$currentUser) return;
		try {
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');

			const docRef = doc(collectionRef, id);
			// TODO: Find correct type
			await updateDoc(docRef, habit as any);
			snackbarMessage = 'Habit saved';
		} catch (error) {
			alert(error);
			snackbarMessage = 'An error occured while saving the habit';
			console.error(error);
		} finally {
			snackbar.open();
		}
	}
</script>

<div class="toolbar">
	<Button href="/habits">
		<Icon class="material-icons">arrow_left</Icon>
		<Label>My habits</Label>
	</Button>
	<div class="spacer" />
	<Button type="submit" on:click={updateHabit}>
		<Icon class="material-icons">save</Icon>
		<Label>Save</Label>
	</Button>
	<Button type="submit" on:click={deleteHabit}>
		<Icon class="material-icons">delete</Icon>
		<Label>Delete</Label>
	</Button>
</div>

<h2>Habit</h2>

{#if $currentUser}
	{#if habit}
		<!-- TODO: Improve layout -->
		<div class="habit-details">
			<Textfield
				bind:value={habit.title}
				label="Title"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>
			<Textfield
				bind:value={habit.category}
				label="Category"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>

			<Textfield
				class="description"
				bind:value={habit.description}
				label="Description"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>
		</div>

		<h4>Achievements</h4>
		<p>
			<MonthSelector bind:month bind:year />
		</p>

		<HabitsTable {month} {year} habits={[habit]} hideHabitName preventCategorization />
	{:else}
		<p>Habit not found</p>
	{/if}
{:else}
	<p>Only authenticated users can see this resource</p>
{/if}

<Snackbar bind:this={snackbar}>
	<SnackbarLabel>{snackbarMessage}</SnackbarLabel>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<style>
	.toolbar {
		display: flex;
	}
	.spacer {
		flex-grow: 1;
	}

	.habit-details {
		display: flex;
		gap: 0.5em;
		flex-wrap: wrap;
	}

	:global(.habit-details > *) {
		flex-basis: 20ch;
		flex-grow: 1;
		flex-shrink: 0;
	}

	:global(.description) {
		flex-grow: 5;
	}
</style>
