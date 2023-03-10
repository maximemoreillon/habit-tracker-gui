<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';

	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { AppContent } from '@smui/drawer';

	import { currentUser } from '$lib/firebase';
	import NavDrawer from '$lib/NavDrawer.svelte';
	import AuthenticationWall from '$lib/AuthenticationWall.svelte';
	import LogoutButton from '$lib/LogoutButton.svelte';

	let topAppBar: TopAppBar;
	let open = false;

	// PWA auto update
	// https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#auto-update
	onMount(async () => {
		if (!pwaInfo) return;
		// @ts-ignore
		const { registerSW } = await import('virtual:pwa-register');
		registerSW({
			immediate: true,
			onRegistered(r: any) {
				// uncomment following code if you want check for updates
				// r && setInterval(() => {
				//    console.log('Checking for sw update')
				//    r.update()
				// }, 20000 /* 20s for testing purposes */)
				console.log(`SW Registered: ${r}`);
			},
			onRegisterError(error: any) {
				console.log('SW registration error', error);
			}
		});
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

{#if $currentUser === undefined}
	<AuthenticationWall />
{:else}
	<!-- <NavDrawer bind:open />
	<AppContent> -->
	<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary">
		<Row>
			<Section>
				<!-- <IconButton class="material-icons" on:click={() => (open = !open)}>menu</IconButton> -->
				<img class="logo" src="/logo.png" alt="" />
				<Title>Habit tracker</Title>
			</Section>
			{#if $currentUser}
				<Section align="end" toolbar>
					<LogoutButton />
				</Section>
			{/if}
		</Row>
	</TopAppBar>
	<AutoAdjust {topAppBar}>
		<main>
			<slot />
		</main>
	</AutoAdjust>
	<!-- </AppContent> -->
{/if}

<style>
	main {
		position: relative;
	}

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
