<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	export let month: number;
	export let year: number;

	function previousMonth() {
		if (month > 0) month--;
		else {
			month = 11;
			year--;
		}
	}

	function nextMonth() {
		if (month < 11) month++;
		else {
			month = 0;
			year++;
		}
	}
</script>

<div class="wrapper">
	<Textfield bind:value={year} label="Year" type="number" />

	<IconButton class="material-icons" on:click={() => previousMonth()}>arrow_left</IconButton>

	<Select bind:value={month} label="Month">
		{#each [...Array(12).keys()] as month}
			<!-- WARNING: January is 0 -->
			<Option value={month}>{month + 1}</Option>
		{/each}
	</Select>

	<IconButton class="material-icons" on:click={() => nextMonth()}>arrow_right</IconButton>
</div>

<style>
	.wrapper {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}
</style>
