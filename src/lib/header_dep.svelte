<script>
	import { fade } from 'svelte/transition';

	$: pageTitle = 'Generated Visualization';

	// open/close navigation panel
	let expanded = false;
	function toggleHeight() {
		expanded = !expanded;
	}
</script>

<header class="fixed left-0 top-0 right-0">
	<!-- HEADER BAR -->
	<div class="relative w-100 grid grid-cols-12 gap-6">
		<div
			class="col-span-10 col-start-2 bg-black px-6 pb-1 h-12 flex items-center justify-between border-l border-r border-b border-grey"
		>
			<div class="flex">
				<h1>Collection Ernst Brunner</h1>
				<h2 class="pl-4 text-blue">{pageTitle}</h2>
			</div>
			<div>
				<button on:click={toggleHeight}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="50"
						height="18"
						viewBox="0 0 50 18"
						fill="none"
					>
						<path d="M1 1L25 17L49 1" stroke="#5A5A5A" />
					</svg>
				</button>
			</div>
		</div>
	</div>
	<!-- VISUALIZATION GENERATOR -->
	{#if expanded}
		<div transition:fade={{ delay: 150, duration: 200 }} class="grid grid-cols-12 gap-6">
			<div class="col-span-10 col-start-2 border-l border-r border-b border-grey">
				<div class="grid grid-cols-3 px-6 gap-6 bg-black">
					<div class="col-span-1 py-5 border-r border-grey">
						<p class="font-mono text-mono-sm pb-3">Analytical Interest</p>
						<p>Releationship</p>
						<p>Time</p>
						<p>Space</p>
					</div>
					<div class="col-span-1 pt-5 pb-4 border-r border-grey">
						<p class="font-mono text-mono-sm pb-3">Data</p>
						<p>Keywords</p>
						<p>Dates</p>
						<p>Locations</p>
						<p>Comments</p>
					</div>
					<div class="col-span-1 pt-5 pb-4">
						<p class="font-mono text-mono-sm pb-3">Data Manipulation</p>
						<p>Co-Occurence Matrix</p>
						<p>Force-Directed Graph</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>
