<script>
	export let currentSetting;
	console.log('thread', currentSetting);

	import { panelVisible } from './store';
	function togglePanel() {
		panelVisible.update((visible) => !visible);
		console.log(panelVisible)
	}
</script>

<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey pb-4">
	<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Thread</button>
	<!-- DATA SETDETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentSetting && currentSetting['data']}
			<p class="font-mono text-mono-sm">{@html currentSetting['data']['details']}</p>
		{/if}
	</div>
	<!-- METADATA DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentSetting && currentSetting['meta-data']}
			<p class="font-mono text-mono-sm">{@html currentSetting['meta-data']['details']}</p>
		{/if}
	</div>
	<!-- DATA CURATION DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentSetting && currentSetting['data-curation']}
			<p class="font-mono text-mono-sm">{currentSetting['data-curation']['details']}</p>
		{/if}
	</div>
	<!-- DATA VISUALIZATION DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentSetting && currentSetting['data-visualization']}
			<p class="font-mono text-mono-sm">{currentSetting['data-visualization']['details']}</p>
		{/if}
	</div>
	<!-- OBJECT VIEWER BUTTON -->
	<button on:click={togglePanel} class="control-btn col-span-2 bg-light text-dark font-mono text-mono-sm h-8"
		>Object Viewer</button
	>
</div>
