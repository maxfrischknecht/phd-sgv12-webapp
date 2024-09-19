<script>
	import { onMount, onDestroy } from 'svelte';
	import { metaDataSetting, currentData, currentKeyA, currentKeyB } from './../../lib/store';
	import CoOccurence from '../../lib/visualizations/co-occurence.svelte';

	let currentMetaData = [];
	let unsubscribe;

	onMount(() => {
		unsubscribe = metaDataSetting.subscribe((value) => {
			if (Array.isArray(value) && value.length > 1) {
				let vizKeyA = value[0]['key'];
				let vizKeyB = value[1]['key'];
				currentKeyA.set(vizKeyA);
				currentKeyB.set(vizKeyB);
				console.log('set keys: ', vizKeyA, vizKeyB);
				loadData(value);
			} else {
				console.log('no meta data set yet');
			}
			currentMetaData = value;
		});
	});

	async function loadData(storeObj) {
		const path = `/data/sgv-12_${storeObj[0].id}_${storeObj[1].id}_matrix.json`;
		console.log('loading...', path);
		try {
			const response = await fetch(path);
			const data = await response.json();
			// Sort the data by 'magnitude' from large to small
			data.sort((a, b) => b['value'] - a['value']);
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

{#if !currentMetaData.length && currentMetaData.length < 2}
	<div class="grid grid-cols-12 gap-6 px-6 mb-1 pt-6">
		<div class="col-span-4">
			<p class="font-mono text-mono-sm">Please select some meta-data for analysis.</p>
		</div>
	</div>
{:else}
	<CoOccurence></CoOccurence>
{/if}
