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
	<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary">
		<Row>
			<Section>
				<IconButton class="material-icons" on:click={() => (open = !open)}>menu</IconButton>
				<img class="logo" src="/logo.png" alt="" />
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

<style>
	.logo {
		height: 2.5em;
		widows: 2.5em;

		animation-name: rotating_logo;
		animation-duration: 60s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes rotating_logo {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
