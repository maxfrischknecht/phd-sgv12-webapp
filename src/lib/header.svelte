<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import Tread from './tread.svelte';
	import {
		appSettingsStore,
		metaDataSetting,
		dataInterpretationSetting,
		viewVisualization,
		headerHeight
	} from './store';
	import { clearMetaData } from './utilities/clearMetaData.js';
	import { clearDataInterpretation } from './utilities/clearDataInterpretation.js';
	import { setDataInterpretation } from './utilities/setDataInterpretation.js';
	import { setMetaData } from './utilities/setMetaData.js';

	function toggleView(view) {
		viewVisualization.set(view);
	}

	async function setHeaderHeight(newHeight) {
		await tick(); // Wait for the DOM to update
		const header = document.querySelector('header'); // Adjust the selector as needed
		if (header) {
			const newHeight = header.offsetHeight;
			headerHeight.set(newHeight);
			// console.log('new header height: ', newHeight);
		}
	}

	// load the generative settings to create the navigation structure of the page
	let appSettings;
	onMount(async () => {
		try {
			const response = await fetch('/generative-settings.json');
			if (response.ok) {
				appSettings = await response.json();
				appSettingsStore.set(appSettings); // set for dataInterpretation function
				console.log('app settings set');
			} else {
				console.error('Failed to load JSON data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		setHeaderHeight();
	});
</script>

<header class="w-100 min-h-8 bg-background">
	<!-- 1st Row: SETTINGS BTN & SECTIONS HEADERS -->
	<div class="grid grid-cols-12 gap-6 px-6">
		<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Settings</button>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Data Set</div>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Data Interpretation</div>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Meta Data</div>

		<div class="col-span-2 col-start-11 flex">
			<!-- VISUALIZATION BUTTON -->
			<button
				class="border-b border-l border-grey font-mono text-mono-sm h-8 flex-1"
				class:bg-light={$viewVisualization}
				class:text-dark={$viewVisualization}
				class:text-grey={!$viewVisualization}
				on:click={() => toggleView(true)}
			>
				Display
			</button>
			<!-- CURATION BUTTON -->
			<button
				class="border-b border-l border-r border-grey font-mono text-mono-sm h-8 flex-1"
				class:bg-light={!$viewVisualization}
				class:text-dark={!$viewVisualization}
				class:text-grey={$viewVisualization}
				on:click={() => toggleView(false)}
			>
				Curation
			</button>
		</div>
	</div>

	<!-- 2nd Row: SECTION OPTIONS -->
	<div class="grid grid-cols-12 gap-6 px-6 pb-4 border-b border-grey">
		<!-- DATA SET OPTIONS aka HOME BTN -->
		<div class="col-start-3 col-span-2 font-sans text-sans-md">
			<a
				href="/"
				on:click={(event) => {
					clearMetaData();
					clearDataInterpretation();
				}}
			>
				Negatives Ernst Brunner Collection
			</a>
		</div>
		<!-- DATA INTERPRETATION OPTIONS -->
		{#if appSettings != null && appSettings['data-interpretation'] && appSettings['data-interpretation'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each appSettings['data-interpretation'] as option}
					<a
						href="/{option.id}"
						on:click={() => setDataInterpretation(option)}
						class="block {$dataInterpretationSetting.id === option.id ? 'text-blue' : ''}"
					>
						{option.label}
					</a>
				{/each}
			</div>
		{/if}
		<!-- META DATA OPTIONS -->
		{#if appSettings != null && appSettings['meta-data'] && appSettings['meta-data'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each appSettings['meta-data'] as option}
					<button
						on:click={() => {
							// Prevent deselection if option.id matches dataInterpretationSetting["variable-fixed"]
							if (
								$dataInterpretationSetting &&
								$dataInterpretationSetting['variable-fixed'] !== option.id
							) {
								setMetaData(option);
							}
						}}
						class="block {!(
							$dataInterpretationSetting && Object.keys($dataInterpretationSetting).length > 0
						)
							? 'text-grey' // Apply text-grey if dataInterpretationSetting is not defined or empty
							: $metaDataSetting.some((item) => item.id === option.id)
								? 'text-blue'
								: $metaDataSetting.length >= $dataInterpretationSetting['variable-count']
									? 'text-grey'
									: ''}"
						disabled={!(
							$dataInterpretationSetting && Object.keys($dataInterpretationSetting).length > 0
						) || // Check if dataInterpretationSetting is defined and not empty
							($metaDataSetting.length >= $dataInterpretationSetting['variable-count'] &&
								!$metaDataSetting.some((item) => item.id === option.id)) ||
							$dataInterpretationSetting['variable-fixed'] === option.id}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- THREAD -->
	<Tread />
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
</style>
