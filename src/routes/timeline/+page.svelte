<script>
	import { onMount, onDestroy } from 'svelte';
	import { metaDataSetting } from './../../lib/store';

	let currentMetaData = [];
	let unsubscribe;
	onMount(() => {
		unsubscribe = metaDataSetting.subscribe((value) => {
			if (Array.isArray(value) && value.length > 0) {
				console.log('new data in store', value);
			} else {
				console.log('no meta data set yet');
			}
			currentMetaData = value;
		});
	});

	// Cleanup subscription when component is destroyed
	onDestroy(() => {
		unsubscribe();
	});
</script>

<h1>Timeline</h1>
<!-- {#if currentMetaData}
	{#each currentMetaData as setting}
		<p class="font-mono text-mono-sm">{setting.id}</p>
	{/each}
{/if} -->
