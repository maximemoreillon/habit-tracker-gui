<script lang="ts">
	import '$lib/firebase';

	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { AppContent } from '@smui/drawer';

	import { currentUser } from '$lib/firebase';
	import NavDrawer from '$lib/NavDrawer.svelte';

	let topAppBar: TopAppBar;
	let open = false;
</script>

<NavDrawer bind:open />
<AppContent>
	<TopAppBar bind:this={topAppBar} variant="fixed">
		<Row>
			<Section>
				<IconButton class="material-icons" on:click={() => (open = !open)}>menu</IconButton>
				<Title>Habit tracker</Title>
			</Section>
		</Row>
	</TopAppBar>
	<AutoAdjust {topAppBar}>
		<main>
			{#if $currentUser === undefined}
				<p>Waiting for authentication</p>
			{:else}
				<slot />
			{/if}
		</main>
	</AutoAdjust>
</AppContent>
