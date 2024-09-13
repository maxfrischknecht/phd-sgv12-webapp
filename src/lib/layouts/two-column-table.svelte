<script>
    import { imageIdsStore } from './../store';

    export let displayData;
    export let tableTitle;
	export let key;

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