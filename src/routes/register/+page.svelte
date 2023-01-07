<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label, Icon as BtnIcon } from '@smui/button';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/firebase';
	import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

	let email = '';
	let password = '';
	let passwordConfirm = '';
	let loading = false;

	const auth = getAuth();

	const register = async () => {
		if (password !== passwordConfirm) return alert('Passwords do not match');
		loading = true;
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			goto('/home');
		} catch (error) {
			alert(error);
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<h2>Register</h2>

{#if $currentUser}
	<p>Logged in as {$currentUser.email}</p>
{:else}
	<form on:submit|preventDefault={register}>
		<Textfield bind:value={email} label="E-mail">
			<Icon class="material-icons" slot="leadingIcon">person</Icon>
		</Textfield>

		<Textfield bind:value={password} label="Password" type="password">
			<Icon class="material-icons" slot="leadingIcon">key</Icon>
		</Textfield>

		<Textfield bind:value={passwordConfirm} label="Password confirm" type="password">
			<Icon class="material-icons" slot="leadingIcon">key</Icon>
		</Textfield>

		<Button>
			<BtnIcon class="material-icons">add</BtnIcon>
			<Label>Register</Label>
		</Button>

		<p>
			Already have an account? Click <a href="/login">here</a> to login.
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
