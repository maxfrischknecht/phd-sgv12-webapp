<script>
	import { onMount } from 'svelte';
	import { imageIdsStore } from './../../lib/store';

	let displayData = [];

	onMount(async () => {
		const response = await fetch('/data/sgv-12_comments.json');
		const data = await response.json();
		// displayData = data.sort((a, b) => a.label.localeCompare(b.label));
		displayData = data;
		console.log(data.length);
	});

	function handleRowClick(imageIds) {
		imageIdsStore.set(imageIds);
	}
</script>

<!-- TABLE HEADER -->
<div class="grid grid-cols-12 gap-6 px-6 mb-6">
	<div class="col-span-6 py-2 cursor-pointer">
		<p class="font-mono text-mono-sm hover:underline">Identifiers</p>
	</div>
	<div class="col-span-6 py-2">
		<p class="font-mono text-mono-sm">Comments</p>
	</div>
</div>

<!-- TABLE CONTENT -->
{#each displayData as item}
	<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey cursor-pointer">
		<div class="col-span-6 py-2">
			<p class="font-mono text-mono-sm">
				{#each item['image_ids'] as id}
					{` ${id} `}
				{/each}
			</p>
		</div>
		<div class="col-span-6 py-2">
			<p class="font-mono text-mono-sm">{item.label}</p>
		</div>
	</div>
{/each}
