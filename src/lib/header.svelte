<script>
	import { onMount, tick } from 'svelte';
	import Tread from './tread.svelte';
	import {
		metaDataSetting,
		dataInterpretationSetting,
		viewVisualization,
		headerHeight
	} from './store';

	function toggleView(view) {
		viewVisualization.set(view);
	}

	async function setHeaderHeight(newHeight) {
		await tick(); // Wait for the DOM to update
		const header = document.querySelector('header'); // Adjust the selector as needed
		if (header) {
			const newHeight = header.offsetHeight;
			headerHeight.set(newHeight);
			console.log('new header height: ', newHeight);
		}
	}

	// the settings to create all navigation options
	let settings = null;
	// Fetch the settings to dynamically generate the navigations
	onMount(async () => {
		try {
			const response = await fetch('/generative-settings.json');
			if (response.ok) {
				settings = await response.json();
			} else {
				console.error('Failed to load JSON data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		// get & set the headerHeight for defining content height
		setHeaderHeight();
	});

	function setDataInterpretation(newObject) {
		// Set the dataInterpretationSetting
		dataInterpretationSetting.set(newObject);

		// Check if "variable-fixed" is not an empty string
		if (newObject['variable-fixed'] && newObject['variable-fixed'] !== '') {
			// Search for the object in settings['meta-data'] that matches the id from "variable-fixed"
			const fixedObject = settings['meta-data'].find(
				(item) => item.id === newObject['variable-fixed']
			);

			if (fixedObject) {
				// If the object is found, set it as metaDataSetting
				metaDataSetting.set([fixedObject]);
			} else {
				// If no matching object is found, clear metaDataSetting
				metaDataSetting.set([]);
			}
		} else {
			// If "variable-fixed" is an empty string, clear metaDataSetting
			metaDataSetting.set([]);
		}
	}

	// update the metaDataSetting and order alphabetically for link construction
	function setMetaData(newObject) {
		metaDataSetting.update((objects) => {
			const index = objects.findIndex((obj) => obj.id === newObject.id);
			if (index === -1) {
				return [...objects, newObject].sort((a, b) => a.id.localeCompare(b.id));
			} else {
				return objects.filter((_, i) => i !== index).sort((a, b) => a.id.localeCompare(b.id));
			}
		});
	}

	let currentDataInterpretation = {};
	dataInterpretationSetting.subscribe((value) => {
		currentDataInterpretation = value;
	});

	// subscribe to the current settings to update the hover effect
	let currentMetaData = [];
	metaDataSetting.subscribe((value) => {
		currentMetaData = value;
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
			<!-- DURATION BUTTON -->
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
			<a href="/">Negatives Ernst Brunner Collection</a>
		</div>
		<!-- DATA INTERPRETATION OPTIONS -->
		{#if settings != null && settings['data-interpretation'] && settings['data-interpretation'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each settings['data-interpretation'] as option}
					<a
						href="/{option.id}"
						on:click={() => setDataInterpretation(option)}
						class="block {currentDataInterpretation.id === option.id ? 'text-blue' : ''}"
					>
						{option.label}
					</a>
				{/each}
			</div>
		{/if}
		<!-- META DATA OPTIONS -->
		{#if settings != null && settings['meta-data'] && settings['meta-data'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each settings['meta-data'] as option}
					<button
						on:click={() => {
							// Prevent deselection if option.id matches dataInterpretationSetting["variable-fixed"]
							if (currentDataInterpretation['variable-fixed'] !== option.id) {
								setMetaData(option);
							}
						}}
						class="block {currentMetaData.some((item) => item.id === option.id)
							? 'text-blue'
							: currentMetaData.length >= currentDataInterpretation['variable-count']
								? 'text-grey'
								: ''}"
						disabled={(currentMetaData.length >= currentDataInterpretation['variable-count'] &&
							!currentMetaData.some((item) => item.id === option.id)) ||
							currentDataInterpretation['variable-fixed'] === option.id}
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
