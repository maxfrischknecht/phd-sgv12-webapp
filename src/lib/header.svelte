<script>
	import { onMount, tick } from 'svelte';
	import Tread from './tread.svelte';
	import { viewVisualization } from './store';
	import { headerHeight } from './store'; // Adjust the path as needed
	import { get } from 'svelte/store';

	// get the current route to set the settings on reload
	// /keywords, /co-occurence-matrix
	import { page } from '$app/stores';
	$: firstLevelRoute = $page.url.pathname.split('/')[1]; // keywords
	$: secondLevelRoute = $page.url.pathname.split('/')[2]; // co-occurence

	// keep track of the current settings based on section interaction
	$: currentSetting = {
		data: null,
		'meta-data': null,
		'data-interpretartion': null
	};

	function toggleView(view) {
		viewVisualization.set(view);
	}

	async function setHeaderHeight(newHeight) {
		await tick(); // Wait for the DOM to update
		const header = document.querySelector('header'); // Adjust the selector as needed
		if (header) {
			const newHeight = header.offsetHeight;
			headerHeight.set(newHeight);
			console.log("new header height: ", newHeight)
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
				// set data set to default
				currentSetting['data'] = settings['data-set'][0];
			} else {
				console.error('Failed to load JSON data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		// on mount set all settings based on current routes
		if (firstLevelRoute) {
			let currentMetaData = settings['meta-data'].find((item) => item.id === firstLevelRoute);
			if (currentMetaData) currentSetting['meta-data'] = currentMetaData;
		}
		if (secondLevelRoute) {
			let currentDataInterpretation = settings['data-interpretation'][firstLevelRoute].find(
				(item) => item.id === secondLevelRoute
			);
			if (currentDataInterpretation)
				currentSetting['data-interpretation'] = currentDataInterpretation;
		}

		// get & set the headerHeight for defining content height
		setHeaderHeight();
	});

	// update the currentSettings by section interaction
	function setDataSet() {
		currentSetting['meta-data'] = null;
		currentSetting['data-interpretation'] = null;
		// console.log('set data set', 'default ernst brunner negatives');
	}
	function setMetaData(metadata) {
		currentSetting['meta-data'] = metadata;
		currentSetting['data-interpretation'] = null;
		// console.log('set meta data', metadata);
	}
	function setDataInterpretation(datainterpretation) {
		currentSetting['data-interpretation'] = datainterpretation;
		// console.log('set data curation', datainterpretation);
	}
</script>

<header class="w-100 min-h-8 bg-background">
	<!-- 1st Row: SETTINGS BTN & SECTIONS HEADERS -->
	<div class="grid grid-cols-12 gap-6 px-6">
		<button class="col-span-2 bg-light text-dark font-mono text-mono-sm h-8">Settings</button>
		{#if settings === null}
			<p class="font-mono text-mono-sm">generating sections...</p>
		{:else if settings.sections && settings.sections.length > 0}
			{#each settings.sections as section}
				<div class="col-span-2 h-8 flex items-center font-mono text-mono-sm">{section}</div>
			{/each}
		{:else}
			<p class="font-mono text-mono-sm">No sections available</p>
		{/if}
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
		<!-- always visible -->
		{#if settings != null && settings['data-set'] && settings['data-set'].length > 0}
			<div class="col-start-3 col-span-2 font-sans text-sans-md text-blue">
				<a on:click={setDataSet} href="/">{settings['data-set'][0]['label']}</a>
			</div>
		{/if}
		<!-- META DATA OPTIONS -->
		<!-- always visible -->
		{#if settings != null && settings['meta-data'] && settings['meta-data'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each settings['meta-data'] as option}
					<a
						on:click={() => setMetaData(option)}
						on:mouseover={() => setMetaData(option)}
						on:focus={() => setMetaData(option)}
						href="/{option.id}"
						class="block {currentSetting['meta-data'] &&
						currentSetting['meta-data']['id'] === option.id
							? 'text-blue'
							: ''}"
						>{option.label}
					</a>
				{/each}
			</div>
		{/if}
		<!-- DATA INTERPRETATION OPTIONS -->
		<!-- visible depending on subpage route, e.g /keywords -->
		{#if settings != null && currentSetting['meta-data']}
			<div class="col-span-2 font-sans text-sans-md">
				{#each Object.keys(settings['data-interpretation']) as optionKey}
					{#if currentSetting['meta-data']['id'] == optionKey}
						<div id={optionKey}>
							{#each settings['data-interpretation'][optionKey] as option}
								<!-- hover over these will dynamically show data viz options -->
								<a
									on:mouseover={() => setDataInterpretation(option)}
									on:focus={() => setDataInterpretation(option)}
									on:click={() => setDataInterpretation(option)}
									href="/{currentSetting['meta-data']['id']}/{option.id}"
									class="block {currentSetting['data-interpretation'] &&
									currentSetting['data-interpretation']['id'] === option.id
										? 'text-blue'
										: ''}">{option.label}</a
								>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- THREAD -->
	<Tread {currentSetting} />
</header>

<style>
	header {
		position: fixed;
		top:0;
		left: 0;
		right: 0;
	}
</style>
