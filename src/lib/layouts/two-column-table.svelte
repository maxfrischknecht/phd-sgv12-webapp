<script>
	import { headerHeight, imageIdsStore } from './../store';

	export let displayData;
	export let tableTitle;
	export let key;

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
<div id="table-wrapper"  style="height: {contentHeight}; top: {panelTop};">
<!-- TABLE HEADER -->
	<div class="sticky top-0 bg-background grid grid-cols-12 gap-6 px-6 mb-1 border-b border-grey min-h-8">
		<div class="col-span-6 py-2 cursor-pointer">
			<p class="font-mono text-mono-sm hover:underline">Identifiers</p>
		</div>
		<div class="col-span-6 py-2">
			<p class="font-mono text-mono-sm">{tableTitle}</p>
		</div>
	</div>

	<!-- TABLE CONTENT -->
	{#each displayData as item}
		<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey cursor-pointer">
			<div class="col-span-6 py-2">
				<p class="font-mono text-mono-sm">
					{#each item['schema:identifier'] as id}
						{` ${id} `}
					{/each}
				</p>
			</div>
			<div class="col-span-6 py-2">
				<p class="font-mono text-mono-sm">
					{#each item[key] as com}
						{` ${com} `}
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
</style>
