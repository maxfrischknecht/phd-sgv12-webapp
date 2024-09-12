<script>
	import { onMount, tick } from 'svelte';
	import Tread from './tread.svelte';
	import { metaDataSetting } from './store';
	import { viewVisualization } from './store';
	import { headerHeight } from './store'; // Adjust the path as needed

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

	// update the metaDataSetting and order alphabetically for link construction
	function setMetaData(newObject) {
		console.log('add', newObject.id);
		metaDataSetting.update((objects) => {
			const index = objects.findIndex((obj) => obj.id === newObject.id);
			if (index === -1) {
				return [...objects, newObject].sort((a, b) => a.id.localeCompare(b.id));
			} else {
				return objects.filter((_, i) => i !== index).sort((a, b) => a.id.localeCompare(b.id));
			}
		});
	}

	// subscribe to the current setting to update the hover effect
	let currentSetting = [];
	let currentId = '';
	const unsubscribe = metaDataSetting.subscribe((value) => {
		currentId = '';
		value.forEach((el, index) => {
			currentId += el.id;
			if (index < value.length - 1) {
				currentId += '-';
			}
		});
		console.log('current-id', currentId);
		currentSetting = value;
	});
</script>

<header class="w-100 min-h-8 bg-background">
	<!-- 1st Row: SETTINGS BTN & SECTIONS HEADERS -->
	<div class="grid grid-cols-12 gap-6 px-6">
		<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Settings</button>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Data Set</div>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Meta Data</div>
		<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">Data Interpretation</div>

		<div class="col-span-2 flex">
			<!-- VISUALIZATION BUTTON -->
			<button
				class="border-b border-l border-grey font-mono text-mono-sm h-8 flex-1"
				class:bg-light={$viewVisualization}
				class:text-dark={$viewVisualization}
				class:text-grey={!$viewVisualization}
				on:click={() => toggleView(true)}
			>
				Visualization
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
		<div class="col-start-3 col-span-2 font-sans text-sans-md text-blue">
			<a href="/">Negatives Ernst Brunner Collection</a>
		</div>
		<!-- META DATA OPTIONS -->
		<!-- Only Possible to Select Two -->
		{#if settings != null && settings['meta-data'] && settings['meta-data'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each settings['meta-data'] as option}
					<button
						on:click={() => setMetaData(option)}
						class="block {currentSetting.some((item) => item.id === option.id) ? 'text-blue' : ''}"
						disabled={currentSetting.length >= 2 &&
							!currentSetting.some((item) => item.id === option.id)}
						>{option.label}
					</button>
				{/each}
			</div>
		{/if}
		<!-- DATA INTERPRETATION OPTIONS -->
		<!-- visible depending on selected meta data -->
		{#if settings != null && settings['data-interpretation']}
		<div class="col-span-2 font-sans text-sans-md">
			{#each Object.keys(settings['data-interpretation']) as optionKey}
				{#if currentId != '' && currentId == optionKey}
					<div id={optionKey}>
						{#each settings['data-interpretation'][optionKey] as option}
							<a
								href="/{option.id}"
								class="block">{option.label}</a
							>
						{/each}
					</div>
				{/if}
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
