<script lang="ts">
	import Drawer, { Content, Header, Title, Subtitle, Scrim } from '@smui/drawer';
	import List, { Item, Text, Graphic } from '@smui/list';
	export let open = false;

	const links = [
		{ text: 'Habits', href: '/', icon: 'list' },
		{ text: 'Login', href: '/login', icon: 'login' }
	];
</script>

<Drawer variant="modal" bind:open fixed={false}>
	<Header>
		<Title>Habit tracker</Title>
	</Header>
	<Content>
		<List>
			{#each links as link}
				<Item href={link.href}>
					<Graphic class="material-icons">{link.icon}</Graphic>
					<Text>{link.text}</Text>
				</Item>
			{/each}
		</List>
	</Content>
</Drawer>
<Scrim fixed={false} />
