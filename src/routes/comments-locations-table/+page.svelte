<script>
	import { onMount } from 'svelte';
	import ThreeColumnTable from '../../lib/layouts/three-column-table.svelte';

	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_comments_locations.json');
		const data = await response.json();
		displayData = data;
		console.log(data.length);
	});
</script>

<ThreeColumnTable {displayData} tableHeader1="Comments" key1="schema:comment" tableHeader2="Locations" key2="schema:location"></ThreeColumnTable>

