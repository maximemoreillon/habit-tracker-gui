<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { currentUser } from '$lib/firebase';

	import { collection, addDoc, getFirestore } from 'firebase/firestore';

	let open = false;

	let newHabit = { title: '', description: '', user_id: $currentUser.uid };

	const createItem = async () => {
		try {
			const firestore = getFirestore();
			const collectionRef = collection(firestore, 'habits');
			await addDoc(collectionRef, newHabit);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<Dialog bind:open>
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">New habit</Title>

	<form on:submit|preventDefault={createItem}>
		<Content>
			<div>
				<Textfield bind:value={newHabit.title} label="Title" />
			</div>
			<div>
				<Textfield bind:value={newHabit.description} label="Description" />
			</div>
		</Content>

		<Actions>
			<Button type="submit">
				<Label>Create</Label>
			</Button>
		</Actions>
	</form>
</Dialog>

<Button on:click={() => (open = true)}>
	<Label>New item</Label>
</Button>
