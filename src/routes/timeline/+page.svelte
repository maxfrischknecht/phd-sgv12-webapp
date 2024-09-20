<script>
	import { onMount, onDestroy } from 'svelte';
	import Placeholder from '../../lib/layouts/placeholder.svelte';
	import { metaDataSetting } from './../../lib/store';

	let currentMetaData = [];
	let unsubscribe = null;
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
		if (typeof unsubscribe === 'function') {
			unsubscribe();
		}
	});
</script>

{#if !currentMetaData.length < 1}
	<Placeholder></Placeholder>
{:else}
	<h1>Time Line Viz to be done</h1>
{/if}
