<script>
	import { metaDataSetting, dataInterpretationSetting } from './store';
	import { slide } from 'svelte/transition'; // Import the slide transition
	import { panelVisible } from './store';

	let threadVisible = true; // Local state for the visibility of the thread panel

	// Function to toggle the thread panel visibility
	function toggleThreadPanel() {
		threadVisible = !threadVisible;
	}

	function togglePanel() {
		panelVisible.update((visible) => !visible);
		console.log(panelVisible);
	}
</script>

<div id="thread-wrapper" class="border-b border-grey">
	<div id="thread-min">
		<div class="grid grid-cols-12 gap-6 px-6">
			<button
				id="thread-btn"
				class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8"
				on:click={toggleThreadPanel}>Thread</button
			>
			<!-- DATA SETDETAILS -->
			<div class="col-span-2 mt-2">
				<p class="font-mono text-mono-sm">47'837 Objects</p>
			</div>
			<!-- DATA INTERPRETATION DETAILS -->
			<div class="col-span-2 mt-2">
				{#if $dataInterpretationSetting.id}
					<p class="font-mono text-mono-sm capitalize">
						{$dataInterpretationSetting.id}
					</p>
				{:else}
					<p class="font-mono text-mono-sm">No data interpretation</p>
				{/if}
			</div>
			<!-- METADATA DETAILS -->
			<div class="col-span-2 mt-2">
				{#if $metaDataSetting.length}
					<p class="font-mono text-mono-sm capitalize">
						{#each $metaDataSetting as setting, index}
							{setting.id}{index < $metaDataSetting.length - 1 ? ', ' : ''}
						{/each}
					</p>
				{:else}
					<p class="font-mono text-mono-sm">No meta data</p>
				{/if}
			</div>
			<!-- OBJECT VIEWER BUTTON -->
			<button
				on:click={togglePanel}
				class="control-btn col-span-2 col-start-11 text-grey border-l border-r border-grey font-mono text-mono-sm h-8 {threadVisible ? 'border-b' : ''}"
				>Object Viewer</button
			>
		</div>
	</div>
	<!-- Slide transition for the thread panel -->
	{#if threadVisible}
		<div id="thread-max" transition:slide>
			<div class="grid grid-cols-12 gap-6 px-6">
				<!-- DATA INTERPRETATION DETAILS -->
				<div class="col-span-2 col-start-5">
					{#if $dataInterpretationSetting.id}
						<p class="font-mono text-mono-sm pb-4">
							{$dataInterpretationSetting.description}
						</p>
					{/if}
				</div>
				<!-- METADATA DETAILS -->
				<div class="col-span-2">
					{#if $metaDataSetting.length}
						{#each $metaDataSetting as setting}
							<p class="font-mono text-mono-sm pb-4">{@html setting.description}</p>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	#thread-max {
		overflow: hidden; /* Ensure the content is hidden during slide animation */
	}
</style>
