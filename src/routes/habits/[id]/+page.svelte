<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/firebase';

	import { page } from '$app/stores';
	import type Habit from '$lib/types/habit';
	import { getFirestore, collection, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

	const firestore = getFirestore();

	let habit: Habit;
	const { id } = $page.params;

	// TODO: subscribe to current user so as to run only when user data is available

	currentUser.subscribe((user) => {
		if (!user) return;
		getHabit();
	});

	// TODO: prevent seeing other users' habits
	async function getHabit() {
		try {
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');

			const docRef = doc(collectionRef, id);
			const docSnap = await getDoc(docRef);
			habit = docSnap.data();
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}

	async function deleteHabit() {
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
		try {
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');

			const docRef = doc(collectionRef, id);
			await updateDoc(docRef, habit);
			alert('Habit updated successfully');
		} catch (error) {
			alert(error);
			console.error(error);
		}
	}
</script>

<h2>Habit</h2>
{#if $currentUser}
	{#if habit}
		<!-- TODO: Improve layout -->
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
		<p>
			<Textfield bind:value={habit.title} label="Title" type="text" />
		</p>
		<p>
			<Textfield bind:value={habit.description} label="Description" type="text" />
		</p>
	{/if}
{:else}
	<p>Only authenticated users can see this resource</p>
{/if}
