<script>
	import { onMount } from 'svelte';
	import ThreeColumnTable from '../../lib/layouts/three-column-table.svelte';

	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_dates_keywords.json');
		const data = await response.json();
		displayData = data;
		console.log(data.length);
	});
</script>

<ThreeColumnTable {displayData} tableHeader1="Dates" key1="schema:temporal" tableHeader2="Keywords" key2="schema:about"></ThreeColumnTable>

