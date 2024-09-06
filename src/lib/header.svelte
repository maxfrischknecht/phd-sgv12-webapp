<script>
	import { onMount } from 'svelte';
	import Tread from './tread.svelte';

	// get the current route to set the settings on reload
	// /keywords, /co-occurence-matrix
	import { page } from '$app/stores';
	$: firstLevelRoute = $page.url.pathname.split('/')[1]; // keywords
	$: secondLevelRoute = $page.url.pathname.split('/')[2]; // co-occurence
	$: thirdLevelRoute = $page.url.pathname.split('/')[3]; // matrix

	// keep track of the current settings based on section interaction
	$: currentSetting = {
		data: null,
		'meta-data': null,
		'data-curation': null,
		'data-visualization': null
	};;

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
			let currentDataCuration = settings['data-curation'][firstLevelRoute].find((item) => item.id === secondLevelRoute)
			if (currentDataCuration) currentSetting["data-curation"] = currentDataCuration;
		}
		if (thirdLevelRoute){
			let currentDataVisualization = settings['data-visualization'][secondLevelRoute].find((item) => item.id === thirdLevelRoute)
			if (currentDataVisualization) currentSetting["data-visualization"] = currentDataVisualization;
		}
	});

	// update the currentSettings by section interaction
	function setDataSet() {
		currentSetting['meta-data'] = null;
		currentSetting['data-curation'] = null;
		currentSetting['data-visualization'] = null;
		// console.log('set data set', 'default ernst brunner negatives');
	}
	function setMetaData(metadata) {
		currentSetting['meta-data'] = metadata;
		currentSetting['data-curation'] = null;
		currentSetting['data-visualization'] = null;
		// console.log('set meta data', metadata);
	}
	function setDataCuration(datacuration) {
		currentSetting['data-curation'] = datacuration;
		currentSetting['data-visualization'] = null;
		// console.log('set data curation', datacuration);
	}
	function setDataVisualization(datavisualization) {
		currentSetting['data-visualization'] = datavisualization;
		// console.log('set data curation', datavisualization);
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
						on:click={setMetaData(option)}
						on:mouseover={setMetaData(option)}
						on:focus={setMetaData(option)}
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
		<!-- DATA CURATION OPTIONS -->
		<!-- visible depending on subpage route, e.g /keywords -->
		<!-- not clickable, only shows viz options -->
		{#if settings != null && currentSetting['meta-data']}
			<div class="col-span-2 font-sans text-sans-md">
				{#each Object.keys(settings['data-curation']) as optionKey}
					{#if currentSetting['meta-data']['id'] == optionKey}
						<div id={optionKey}>
							{#each settings['data-curation'][optionKey] as option}
								<!-- hover over these will dynamically show data viz options -->
								<button
									on:mouseover={setDataCuration(option)}
									on:focus={setDataCuration(option)}
									class="block {currentSetting['data-curation'] &&
									currentSetting['data-curation']['id'] === option.id
										? 'text-blue'
										: ''}">{option.label}</button
								>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
		<!-- DATA VISUALIZATION OPTIONS -->
		<!-- visible on hover of data curation option -->
		{#if settings != null && currentSetting['data-curation'] != null}
			<div class="col-span-2 font-sans text-sans-md">
				{#each Object.keys(settings['data-visualization']) as optionKey}
					{#if currentSetting['data-curation']['id'] == optionKey}
						<div id={optionKey}>
							{#each settings['data-visualization'][optionKey] as option}
								<a
									on:mouseover={setDataVisualization(option)}
									on:focus={setDataVisualization(option)}
									href="/{firstLevelRoute}/{optionKey}/{option.id}"
									class="block {currentSetting['data-visualization'] &&
									currentSetting['data-visualization']['id'] === option.id
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
