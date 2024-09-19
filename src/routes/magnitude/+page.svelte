<script>
	import { onMount, onDestroy } from 'svelte';
	import { metaDataSetting, currentData, currentKeyA } from './../../lib/store';
	import Magnitude from '../../lib/visualizations/magnitude.svelte';

	let currentMetaData = [];
	let unsubscribe;

	onMount(() => {
		unsubscribe = metaDataSetting.subscribe((value) => {
			if (Array.isArray(value) && value.length > 0) {
				let vizKey = value[0]['key'];
				currentKeyA.set(vizKey);
				console.log('loading..', vizKey);
				loadData(value);
			} else {
				console.log('no meta data set yet');
			}
			currentMetaData = value;
		});
	});

	async function loadData(storeObj) {
		const path = `/data/sgv-12_${storeObj[0].id}_magnitude.json`;
		console.log('load:', path);
		try {
			const response = await fetch(path);
			const data = await response.json();
			// Sort the data by 'magnitude' from large to small
			data.sort((a, b) => b['magnitude'] - a['magnitude']);
			currentData.set(data);
			console.log('data loaded & set: ', data);
		} catch (error) {
			console.error(`Failed to load data from ${path}:`, error.message);
			displayData = null;
		}
	}

	// Cleanup subscription when component is destroyed
	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if !currentMetaData.length}
	<div class="grid grid-cols-12 gap-6 px-6 mb-1 pt-6">
		<div class="col-span-4">
			<p class="font-mono text-mono-sm">Please select some meta-data for analysis.</p>
		</div>
	</div>
{:else}
	<Magnitude></Magnitude>
{/if}
