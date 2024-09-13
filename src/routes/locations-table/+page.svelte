<script>
	import { onMount } from 'svelte';
	import TwoColumnTable from '$lib/layouts/two-column-table.svelte'

	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_locations.json');
		const data = await response.json();
		displayData = data;
		console.log(data.length);
	});

</script>

<TwoColumnTable {displayData} tableTitle="Locations" key="schema:location"></TwoColumnTable>
