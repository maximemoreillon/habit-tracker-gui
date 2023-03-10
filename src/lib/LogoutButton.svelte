<script lang="ts">
	import IconButton from '@smui/icon-button';

	import { getAuth, signOut } from 'firebase/auth';
	const auth = getAuth();
</script>

<IconButton class="material-icons" on:click={() => signOut(auth)}>logout</IconButton>
