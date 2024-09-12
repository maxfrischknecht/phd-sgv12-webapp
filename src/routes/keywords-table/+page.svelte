<script>
	import { onMount } from 'svelte';
	import { imageIdsStore } from './../../lib/store';

	let sortedData = [];
	let displayData = []
	// let sortLabelAsc = true;
	// let sortCountAsc = true;

	onMount(async () => {
		const response = await fetch('/data/sgv-12_keywords.json');
		const data = await response.json();
		// sortedData = data.sort((a, b) => b.count - a.count);
		sortedData = data.sort((a, b) => a.label.localeCompare(b.label));
		displayData = sortedData;
		console.log(data.length);
	});

	// function sortByLabel() {
	// 	sortedData = sortedData.sort((a, b) => {
	// 		if (sortLabelAsc) {
	// 			return a.label.localeCompare(b.label);
	// 		} else {
	// 			return b.label.localeCompare(a.label);
	// 		}
	// 	});
	// 	sortLabelAsc = !sortLabelAsc;
	// }

	// function sortByCount() {
	// 	sortedData = sortedData.sort((a, b) => {
	// 		if (sortCountAsc) {
	// 			return a.count - b.count;
	// 		} else {
	// 			return b.count - a.count;
	// 		}
	// 	});
	// 	sortCountAsc = !sortCountAsc;
	// }

	function handleRowClick(imageIds) {
		imageIdsStore.set(imageIds);
	}
</script>

<!-- TABLE HEADER -->
<div class="grid grid-cols-12 gap-6 px-6 mb-6">
	<div class="col-span-2 py-2 cursor-pointer">
		<p class="font-mono text-mono-sm hover:underline">Keyword</p>
	</div>
	<div class="col-span-10 py-2">
		<p class="font-mono text-mono-sm">Identifier</p>
	</div>
</div>

<!-- TABLE CONTENT -->
{#each displayData as item}
	<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey cursor-pointer">
		<div class="col-span-2 py-2">
			<p class="font-mono text-mono-sm">{item.label}</p>
		</div>
		<div class="col-span-10 py-2">
			<p class="font-mono text-mono-sm">
				{#each item['image_ids'] as id}
					{` ${id} `}
				{/each}
			</p>
		</div>
	</div>
{/each}
