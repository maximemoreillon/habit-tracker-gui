<script lang="ts">
	import Fab, { Icon } from '@smui/fab';

	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { currentUser } from '$lib/firebase';

	import { collection, addDoc, getFirestore } from 'firebase/firestore';

	let open = false;

	let newHabit = { title: '', description: '' };

	const createItem = async () => {
		if (!$currentUser) return;
		try {
			const firestore = getFirestore();
			const collectionRef = collection(firestore, 'users', $currentUser.uid, 'habits');
			await addDoc(collectionRef, newHabit);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<Dialog bind:open>
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">New habit</Title>

	<!-- TODO: use flex -->
	<form on:submit|preventDefault={createItem}>
		<Content class="form_content">
			<Textfield bind:value={newHabit.title} label="Title" />
			<Textfield bind:value={newHabit.description} label="Description" />
		</Content>

		<Actions>
			<Button type="reset" on:click={() => (open = false)} color="secondary">
				<Label>Cancel</Label>
			</Button>
			<Button type="submit">
				<Label>Create</Label>
			</Button>
		</Actions>
	</form>
</Dialog>

<Fab on:click={() => (open = true)} color="primary">
	<Icon class="material-icons">add</Icon>
</Fab>

<style>
	:global(.form_content) {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
