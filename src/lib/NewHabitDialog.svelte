<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';

	import { collection, addDoc, getFirestore } from 'firebase/firestore';

	import { goto } from '$app/navigation';

	let open = false;

	let newItem = { name: '' };

	const createItem = async () => {
		try {
			const firestore = getFirestore();
			const collectionRef = collection(firestore, 'items');
			const { id } = await addDoc(collectionRef, newItem);
			// goto(`/items/${id}`);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">Dialog Title</Title>

	<form on:submit|preventDefault={createItem}>
		<Content id="simple-content">
			<Textfield bind:value={newItem.name} label="Name" />
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
