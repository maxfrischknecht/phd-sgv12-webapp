<script>
	import { onMount } from 'svelte';
	import MagnitudeMultivar from '../../lib/visualizations/magnitude-multivar.svelte';
	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_dates_locations_magnitude.json');
		const data = await response.json();
		displayData = data.sort((a, b) => b.magnitude - a.magnitude);
		console.log(displayData);
	});
</script>
{#if displayData.length > 0}
	<MagnitudeMultivar {displayData} vizKey="key" key1="schema:location" key2="schema:temporal"></MagnitudeMultivar>
{/if}