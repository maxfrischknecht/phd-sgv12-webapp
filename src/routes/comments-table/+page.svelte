<script>
	import { onMount } from 'svelte';
	import TwoColumnTable from '$lib/layouts/two-column-table.svelte'

	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_comments.json');
		const data = await response.json();
		// displayData = data.sort((a, b) => a.label.localeCompare(b.label));
		displayData = data;
		console.log(data.length);
	});

</script>

<TwoColumnTable {displayData} tableTitle="Comments" key="schema:comment"></TwoColumnTable>