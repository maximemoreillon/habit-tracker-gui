<script lang="ts">
	import type Habit from '$lib/habit';

	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';

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
			alert('Habit updated successfully');
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}
</script>

<Button href="/habits">
	<Icon class="material-icons">arrow_left</Icon>
	<Label>Return to my habits</Label>
</Button>

<h2>Habit</h2>

{#if $currentUser}
	{#if habit}
		<!-- TODO: Improve layout -->
		<p>
			<Textfield
				bind:value={habit.title}
				label="Title"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>
		</p>
		<p>
			<Textfield
				bind:value={habit.description}
				label="Description"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>
		</p>
		<p>
			<Textfield
				bind:value={habit.category}
				label="Category"
				type="text"
				input$emptyValueNull
				input$emptyValueUndefined
			/>
		</p>
		<p>
			<Button type="submit" on:click={updateHabit}>
				<Icon class="material-icons">save</Icon>
				<Label>Update habit</Label>
			</Button>
			<Button type="submit" on:click={deleteHabit}>
				<Icon class="material-icons">delete</Icon>
				<Label>Delete habit</Label>
			</Button>
		</p>

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
