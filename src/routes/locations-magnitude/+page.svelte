<script>
	import { onMount } from 'svelte';
	import Magnitude from '../../lib/visualizations/magnitude.svelte';
	import BubbleChart from '../../lib/visualizations/bubblechart.svelte'
	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_locations_magnitude.json');
		const data = await response.json();
		displayData = data.sort((a, b) => b.magnitude - a.magnitude);
		console.log(displayData);
	});
</script>
{#if displayData.length > 0}
	<Magnitude {displayData} key="schema:location"></Magnitude>
	<!-- <BubbleChart {displayData} key="schema:location"></BubbleChart> -->
{/if}