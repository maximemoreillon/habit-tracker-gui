<script lang="ts">
	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	export let month: number;
	export let year: number;
</script>

<div class="wrapper">
	<Textfield bind:value={year} label="Year" type="number" />
	<Select bind:value={month} label="Month">
		{#each [...Array(12).keys()] as month}
			<!-- WARNING: January is 0 -->
			<Option value={month}>{month + 1}</Option>
		{/each}
	</Select>
</div>

<style>
	.wrapper {
		display: flex;
		gap: 0.5em;
	}
</style>
