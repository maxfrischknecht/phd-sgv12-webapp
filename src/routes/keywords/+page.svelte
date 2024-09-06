<script>
	import { onMount } from 'svelte';

	let sortedData = [];
	let sortLabelAsc = true;
	let sortCountAsc = true;

	onMount(async () => {
		const response = await fetch('/data/sgv-12_all_keywords.json');
		const data = await response.json();
		// sortedData = data.sort((a, b) => b.count - a.count);
        sortedData = data.sort((a, b) => a.label.localeCompare(b.label));
        console.log(data.length)
	});

	function sortByLabel() {
		sortedData = sortedData.sort((a, b) => {
			if (sortLabelAsc) {
				return a.label.localeCompare(b.label);
			} else {
				return b.label.localeCompare(a.label);
			}
		});
		sortLabelAsc = !sortLabelAsc;
	}

	function sortByCount() {
		sortedData = sortedData.sort((a, b) => {
			if (sortCountAsc) {
				return a.count - b.count;
			} else {
				return b.count - a.count;
			}
		});
		sortCountAsc = !sortCountAsc;
	}
</script>

<!-- TABLE HEADER -->
<div class="grid grid-cols-12 gap-6 px-6 mb-6">
	<div class="col-span-3 p-2 cursor-pointer">
		<p class="font-mono text-mono-sm hover:underline" on:click={sortByLabel}>Label</p>
	</div>
	<div class="col-span-3 p-2 cursor-pointer">
		<p class="font-mono text-mono-sm hover:underline" on:click={sortByCount}>Count</p>
	</div>
	<div class="col-span-6 p-2">
		<p class="font-mono text-mono-sm">Example Id's</p>
	</div>
</div>

<!-- TABLE CONTENT -->
{#each sortedData as item}
	<div class="grid grid-cols-12 gap-6 px-6 border-b border-grey">
		<div class="col-span-3 p-2">
			<p class="font-mono text-mono-sm">{item.label}</p>
		</div>
		<div class="col-span-3 p-2">
			<p class="font-mono text-mono-sm">{item.count}</p>
		</div>
		<div class="col-span-6 p-2">
			<p class="font-mono text-mono-sm">
				{#each item.image_ids.slice(0, 5) as image_id}
					<span>{image_id}, </span>
				{/each}...
				<!-- {#each item.image_ids as image_id}
					<span>{image_id}, </span>
				{/each} -->
			</p>
		</div>
	</div>
{/each}
