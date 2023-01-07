<script lang="ts">
	import type Habit from '$lib/types/habit';
	import { Timestamp } from 'firebase/firestore';
	import { onMount, onDestroy } from 'svelte';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import { currentUser } from '$lib/firebase';
	import {
		collection,
		getDocs,
		getFirestore,
		doc,
		updateDoc,
		onSnapshot
	} from 'firebase/firestore';
	import NewHabitDialog from '$lib/NewHabitDialog.svelte';

	let habits: Habit[] = [];
	const firestore = getFirestore();

	onDestroy(() => {
		unsub();
	});

	const collectionRef = collection(firestore, 'habits');

	// const querySnapshot = await getDocs(collectionRef);
	// habits = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

	const unsub = onSnapshot(collectionRef, (collection) => {
		habits = collection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	});

	const achievementsToDayArray = (achievements) =>
		achievements.map((a) => {
			return a.toDate().getDate();
		});

	const createAchievement = async (habit, day) => {
		const date = new Date(`2023-01-${day}`);
		const nt = Timestamp.fromDate(date);
		habit.achievements.push(nt);

		try {
			const collectionRef = collection(firestore, 'habits');
			const docRef = doc(collectionRef, habit.id);
			await updateDoc(docRef, habit);
			alert('Item updated successfully');
		} catch (error) {
			alert(error);
			console.error(error);
		}
	};
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
				<Row>
					<Cell>
						{habit.title}
					</Cell>
					<Cell />
					<!-- This looks very bad -->
					{#each [...Array(31).keys()].map((d) => d + 1) as day}
						{#if achievementsToDayArray(habit.achievements).includes(day)}
							<Cell>🏆</Cell>
						{:else}
							<Cell>
								<IconButton class="material-icons" on:click={() => createAchievement(habit, day)}
									>search</IconButton
								>
							</Cell>
						{/if}
					{/each}
				</Row>
			{/each}
		</Body>
	</DataTable>
{:else}
	<p>This content is only accessible to authenticated users</p>
{/if}
