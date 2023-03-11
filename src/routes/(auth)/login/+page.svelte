<!-- TODO: Loader -->
<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label, Icon as BtnIcon } from '@smui/button';
	import CircularProgress from '@smui/circular-progress';

	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';

	let email = '';
	let password = '';
	let loading = false;
	const auth = getAuth();

	const login = async () => {
		loading = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (error) {
			alert(error);
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<form on:submit|preventDefault={login}>
	<h2>Login</h2>

	<Textfield bind:value={email} label="E-mail">
		<Icon class="material-icons" slot="leadingIcon">person</Icon>
	</Textfield>

	<Textfield bind:value={password} label="Password" type="password">
		<Icon class="material-icons" slot="leadingIcon">key</Icon>
	</Textfield>

	<Button disabled={loading}>
		{#if loading}
			<CircularProgress style="height: 32px; width: 32px;" indeterminate />
		{:else}
			<BtnIcon class="material-icons">login</BtnIcon>
			<Label>Login</Label>
		{/if}
	</Button>

	<p>
		No account yet? Click <a href="/register">here</a> to register.
	</p>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}
</style>
