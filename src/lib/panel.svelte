<script>
	import { panelVisible, headerHeight, objectViewerData, objectViewerLoading, objectViewerError } from './store';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let visible;
	let panelHeight = '100vh'; // Default to full viewport height
	let panelTop = '0px'; // Default top position
	let displayData = [];
	let loading;
	let error = null;

	const unsubscribe = panelVisible.subscribe((value) => {
		visible = value;
	});

	const unsubscribeObjectData = objectViewerData.subscribe((value) => {
		displayData = value;
	});

	const unsubscribeViewerLoading = objectViewerLoading.subscribe((value) => {
		loading = value;
	})

	const unsubscribeViewerError = objectViewerError.subscribe((value) => {
		error = value;
	});
	
	const unsubscribeHeaderHeight = headerHeight.subscribe((value) => {
		panelHeight = `calc(100vh - ${value}px)`;
		panelTop = `${value}px`;
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeObjectData();
		unsubscribeHeaderHeight();
	});
</script>

{#if visible}
	<div
		transition:fly={{ x: 100, duration: 400 }}
		style="height: {panelHeight}; top: {panelTop};"
		class="panel bg-background border-l border-grey w-1/2 absolute right-0"
	>
		<div class="grid grid-cols-6 gap-6 px-6 my-4">
			{#if loading}
				<p class="font-mono text-mono-sm">Loading images...</p>
			{:else if error}
				<p class="font-mono text-mono-sm">Error: {error}</p>
			{:else if displayData.length === 0}
				<p class="font-mono text-mono-sm">No images found. {displayData.length}</p>
			{:else}
					{#each displayData as item, index}
						<div class="col-span-2">
							<img src={item.url} alt={`Image ${index + 1}`} loading="lazy" />
							<p class="font-mono text-mono-sm pt-2">{item.name}</p>
							<p class="font-mono text-mono-sm">{item.identifier}</p>
						</div>
					{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
	.panel {
		/* border: 1px solid red; */
		position: fixed;
		right: 0;
		overflow: auto;
		z-index: 100;
	}
</style>
