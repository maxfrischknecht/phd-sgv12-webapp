<script>
	import { headerHeight, imageIdsStore } from './../store';

	export let displayData;
	export let tableHeader1;
	export let tableHeader2;
	export let key1;
	export let key2;

	let panelTop = '0px'; // Default top position
	let contentHeight = '100vh';

	const unsubscribeHeaderHeight = headerHeight.subscribe((value) => {
		contentHeight = `calc(100vh - ${value}px)`;
		panelTop = `${value}px`;
	});

	function handleRowClick(imageIds) {
		imageIdsStore.set(imageIds);
	}
</script>

<!-- TABLE WRAPPER -->
<div id="table-wrapper" style="height: {contentHeight}; top: {panelTop};">
	<!-- TABLE HEADER -->
	<div class="sticky top-0 bg-background grid grid-cols-12 gap-6 px-6 mb-1 border-b border-grey min-h-8">
		<div class="col-span-4 py-2 cursor-pointer">
			<p class="font-mono text-mono-sm hover:underline">Identifier</p>
		</div>
		<div class="col-span-4 py-2 cursor-pointer">
			<p class="font-mono text-mono-sm hover:underline">{tableHeader1}</p>
		</div>
		<div class="col-span-4 py-2">
			<p class="font-mono text-mono-sm">{tableHeader2}</p>
		</div>
	</div>

	<!-- TABLE CONTENT -->
	{#each displayData as item}
		<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey cursor-pointer">
			<div class="col-span-4 py-2">
				<p class="font-mono text-mono-sm">
					{#each item['schema:identifier'] as el}
						{` ${el} `}
					{/each}
				</p>
			</div>
			<div class="col-span-4 py-2">
				<p class="font-mono text-mono-sm">
					{#each item[key1] as el}
						{` ${el} `}
					{/each}
				</p>
			</div>
			<div class="col-span-4 py-2">
				<p class="font-mono text-mono-sm">
					{#each item[key2] as el}
						{` ${el} `}
					{/each}
				</p>
			</div>
		</div>
	{/each}
</div>

<style>
	#table-wrapper {
		overflow-y: auto;
	}
	p {
		word-wrap: break-word;
		width: 100%; /* or any specific width you need */
	}
</style>
