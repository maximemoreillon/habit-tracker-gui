<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import { pwaInfo } from 'virtual:pwa-info';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { currentUser } from '$lib/firebase';
	import AuthenticationWall from '$lib/AuthenticationWall.svelte';
	import LogoutButton from '$lib/LogoutButton.svelte';

	let topAppBar: TopAppBar;

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
	<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary">
		<Row>
			<Section>
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
{/if}

<style>
	main {
		position: relative;
	}

	.logo {
		height: 2.5em;
		width: 2.5em;

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
