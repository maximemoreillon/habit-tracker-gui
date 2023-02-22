<!-- TODO: Loader -->
<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label, Icon as BtnIcon } from '@smui/button';

	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/firebase';
	import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';

	let email = '';
	let password = '';
	let loggingIn = false;
	const auth = getAuth();

	const login = async () => {
		loggingIn = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (error) {
			alert(error);
			console.error(error);
		} finally {
			loggingIn = false;
		}
	};

	const logout = async () => {
		await signOut(auth);
	};
</script>

{#if $currentUser}
	<p>Logged in as {$currentUser.email}</p>
	<Button on:click={logout}>
		<BtnIcon class="material-icons">logout</BtnIcon>
		<Label>Logout</Label>
	</Button>
{:else}
	<form on:submit|preventDefault={login}>
		<h2>Login</h2>

		<Textfield bind:value={email} label="E-mail">
			<Icon class="material-icons" slot="leadingIcon">person</Icon>
		</Textfield>

		<Textfield bind:value={password} label="Password" type="password">
			<Icon class="material-icons" slot="leadingIcon">key</Icon>
		</Textfield>

		<Button>
			<BtnIcon class="material-icons">login</BtnIcon>
			<Label>Login</Label>
		</Button>

		<p>
			No account yet? Click <a href="/register">here</a> to register.
		</p>
	</form>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}
</style>
