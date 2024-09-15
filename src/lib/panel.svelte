<script>
	import { panelVisible, headerHeight, imageIdsStore } from './store';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let visible;
	let panelHeight = '100vh'; // Default to full viewport height
	let panelTop = '0px'; // Default top position
	let imageIds = [];

	const unsubscribe = panelVisible.subscribe((value) => {
		visible = value;
	});

	const unsubscribeImageIds = imageIdsStore.subscribe((value) => {
		imageIds = value;
	});

	const unsubscribeHeaderHeight = headerHeight.subscribe((value) => {
		panelHeight = `calc(100vh - ${value}px)`;
		panelTop = `${value}px`;
		// console.log(panelHeight, panelTop)
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeImageIds();
		unsubscribeHeaderHeight();
	});
</script>

{#if visible}
	<div
		transition:fly={{ x: 100, duration: 400 }}
		style="height: {panelHeight}; top: {panelTop};"
		class="panel bg-background border-l border-grey w-1/2 absolute right-0"
	>
		<div class="grid col-span-6 gap-6 px-6 my-4">
			<p class="font-mono text-mono-sm">Your Current Selection</p>
			<ul>
				{#each imageIds as id}
					<li class="font-mono text-mono-sm">{id}</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
