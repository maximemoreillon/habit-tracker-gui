<script lang="ts">
	import type Habit from '$lib/habit';
	import HabitRow from '$lib/HabitRow.svelte';

	export let habits: Habit[];
	export let month: number;
	export let year: number;
	export let hideHabitName: boolean = false;
	export let preventCategorization: boolean = false;

	const dayIsCurrent = (day: number) =>
		new Date(year, month, day).toDateString() === new Date().toDateString();

	const dayIsPast = (day: number) => new Date(year, month, day + 1) < new Date();

	$: monthDays = [...Array(new Date(year, month, 0).getDate()).keys()].map((d) => d + 1);

	// Categorization
	$: habitsAreCategorized = habits.some((h) => !!h.category);
	$: categorizedHabits = habits.reduce((prev, h) => {
		const existingCategory = prev.find((p: any) => p.name === h.category);
		if (!existingCategory) prev.push({ name: h.category, habits: [h] });
		else existingCategory.habits.push(h);
		return prev;
	}, [] as any);
</script>

<div class="table_wrapper">
	<table>
		<thead>
			<tr>
				{#if !hideHabitName}
					<th />
				{/if}
				{#each monthDays as day}
					<th class="day" class:current={dayIsCurrent(day)} class:past={dayIsPast(day)}>
						{day}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			<!-- NOTE: using id as key -->
			{#if habitsAreCategorized && !preventCategorization}
				{#each categorizedHabits as category (category)}
					<tr>
						<td class="category">
							{category.name || 'Uncategorized'}
						</td>
						{#each monthDays as day}
							<td class="day" class:current={dayIsCurrent(day)} class:past={dayIsPast(day)} />
						{/each}
					</tr>
					{#each category.habits as habit (habit.id)}
						<HabitRow {habit} {month} {year} {hideHabitName} />
					{/each}
				{/each}
			{:else}
				{#each habits as habit (habit.id)}
					<HabitRow {habit} {month} {year} {hideHabitName} />
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.table_wrapper {
		width: 100%;
		overflow-x: auto;
		position: relative;
	}
	table {
		border-collapse: collapse;
		min-width: 100%;
	}

	table :global(.current) {
		background-color: #44444488 !important;
		color: white;
	}

	table :global(thead .current) {
		border-radius: 0.5rem 0.5em 0 0;
	}

	table :global(tbody tr:last-child .current) {
		border-radius: 0 0 0.5rem 0.5rem;
	}

	table :global(tr:hover td) {
		background-color: #eeeeee;
	}

	table :global(tr:hover td:last-child) {
		border-radius: 0 0.5rem 0.5rem 0;
	}

	table :global(tr:hover td:first-child) {
		border-radius: 0.5rem 0 0 0.5rem;
	}

	/* Sticky header and first column */
	table :global(:is(th, td):first-child) {
		position: sticky;
		left: 0;
		z-index: 2;
		background-color: white;
	}

	.category {
		padding-top: 1em;
		padding-bottom: 0.5em;
	}
</style>
