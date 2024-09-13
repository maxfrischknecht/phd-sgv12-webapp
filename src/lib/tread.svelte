<script>
	import { onDestroy } from 'svelte';
	import { metaDataSetting } from './store';
	import { panelVisible } from './store';

	function togglePanel() {
		panelVisible.update((visible) => !visible);
		console.log(panelVisible);
	}

	let currentSetting = [];
	const unsubscribe = metaDataSetting.subscribe((value) => {
		currentSetting = value;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="grid grid-cols-12 gap-6 min-h-24 px-6 border-b border-grey pb-4">
	<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Thread</button>
	<!-- DATA SETDETAILS -->
	<div class="col-span-2 mt-2">
		<p class="font-mono text-mono-sm">47'837 Objects</p>
	</div>
	<!-- METADATA DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentSetting}
			{#each currentSetting as setting}
				<p class="font-mono text-mono-sm">{setting.id}</p>
			{/each}
		{/if}
	</div>
	<!-- DATA INTERPRETATION DETAILS -->
	<!-- <div class="col-span-2 mt-2">
		{#if metaDataSetting && metaDataSetting['data-curation']}
			<p class="font-mono text-mono-sm">{metaDataSetting['data-curation']['details']}</p>
		{/if}
	</div> -->
	<!-- OBJECT VIEWER BUTTON -->
	<button
		on:click={togglePanel}
		class="control-btn col-span-2 col-start-11 text-grey border-b border-l border-r border-grey font-mono text-mono-sm h-8"
		>Object Viewer</button
	>
</div>
