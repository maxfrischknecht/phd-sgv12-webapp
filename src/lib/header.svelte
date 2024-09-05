<script>
	import { onMount } from 'svelte';
	let settings = null;
	let activeMetaData = null;

	// Fetch the settings to dynamically generate the navigations
	onMount(async () => {
		try {
			const response = await fetch('/generative-settings.json');
			if (response.ok) {
				settings = await response.json();
				console.log('Data fetched:', settings);
			} else {
				console.error('Failed to load JSON data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	// Get the current page for dynamic subnavigation
	// Get the current route an format it from "/about" to "About"
	// save it in a reactive variable with $:
	import { page } from '$app/stores';
	$: currentPage = $page.url.pathname.split('/')[1];

	// console.log($page, currentPage);
</script>

<header class="w-100 min-h-8 bg-background">
	<!-- SECTIONS HEADERS -->
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

	<!-- SECTION OPTIONS -->
	<div class="grid grid-cols-12 gap-6 px-6 pb-4 border-b border-grey">
		<!-- DATA SET OPTIONS -->
		{#if settings != null && settings['data-set'] && settings['data-set'].length > 0}
			<div class="col-start-3 col-span-2 font-sans text-sans-md text-blue">
				<p>{settings['data-set'][0]['label']}</p>
			</div>
		{/if}
		<!-- META DATA OPTIONS -->
		{#if settings != null && settings['meta-data'] && settings['meta-data'].length > 0}
			<div class="col-span-2 font-sans text-sans-md">
				{#each settings['meta-data'] as option}
					<a
						on:mouseover={() => (activeMetaData = option.url)}
						on:focus={() => (activeMetaData = option.url)}
						href="/{option.url}"
						class="block">{option.label}</a
					>
				{/each}
			</div>
		{/if}
		<!-- DATA CURATION OPTIONS -->
		{#if settings != null && currentPage}
			<div class="col-span-2 font-sans text-sans-md">
				{#each Object.keys(settings['data-curation']) as sectionKey}
					{#if activeMetaData == sectionKey}
						<div id={sectionKey}>
							{#each settings['data-curation'][sectionKey] as option}
								<a href="/{option.url}" class="block">{option.label}</a>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</header>
