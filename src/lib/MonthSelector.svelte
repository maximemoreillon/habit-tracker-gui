<script lang="ts">
	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	export let month: number;
	export let year: number;
</script>

<Textfield bind:value={year} label="Year" type="number" />
<Select bind:value={month} label="Month">
	{#each [...Array(12).keys()] as month}
		<!-- WARNING: January is 0 -->
		<Option value={month}>{month}</Option>
	{/each}
</Select>
