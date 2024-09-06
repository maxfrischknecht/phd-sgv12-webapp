<script>
	import { panelVisible } from './store';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let visible;
	let panelHeight = '100vh'; // Default to full viewport height
	let panelTop = '0px'; // Default top position

	const unsubscribe = panelVisible.subscribe((value) => {
		visible = value;
	});

	onMount(() => {
		const header = document.querySelector('header'); // Adjust the selector as needed
		if (header) {
			const headerHeight = header.offsetHeight;
			panelHeight = `calc(100vh - ${headerHeight}px)`;
			panelTop = `${headerHeight}px`;
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if visible}
	<div
		transition:fly={{ x: 100, duration: 400 }}
		style="height: {panelHeight}; top: {panelTop};"
		class="panel bg-background border-l border-grey w-1/2 absolute right-0"
	>
		<div class="grid col-span-6 gap-6 px-6 my-4">
			<p>This is the panel content.</p>
		</div>
	</div>
{/if}
