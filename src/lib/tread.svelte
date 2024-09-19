<script>
	import { onDestroy } from 'svelte';
	import { metaDataSetting, dataInterpretationSetting } from './store';
	import { panelVisible } from './store';

	function togglePanel() {
		panelVisible.update((visible) => !visible);
		console.log(panelVisible);
	}

	let currentMetaData = [];
	metaDataSetting.subscribe((value) => {
		currentMetaData = value;
	});
	let currentDataInterpretation = [];
	dataInterpretationSetting.subscribe((value) => {
		currentDataInterpretation = value;
	});
</script>

<div class="grid grid-cols-12 gap-6 min-h-40 px-6 border-b border-grey pb-4">
	<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Thread</button>
	<!-- DATA SETDETAILS -->
	<div class="col-span-2 mt-2">
		<p class="font-mono text-mono-sm">47'837 Objects</p>
	</div>
	<!-- DATA INTERPRETATION DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentDataInterpretation.id}
			<p class="font-mono text-mono-sm">
				{currentDataInterpretation.description}
			</p>
		{/if}
	</div>
	<!-- METADATA DETAILS -->
	<div class="col-span-2 mt-2">
		{#if currentMetaData}
			{#each currentMetaData as setting}
				<p class="font-mono text-mono-sm">{@html setting.description}</p>
			{/each}
		{/if}
	</div>
	<!-- OBJECT VIEWER BUTTON -->
	<button
		on:click={togglePanel}
		class="control-btn col-span-2 col-start-11 text-grey border-b border-l border-r border-grey font-mono text-mono-sm h-8"
		>Object Viewer</button
	>
</div>
