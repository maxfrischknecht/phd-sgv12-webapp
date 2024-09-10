<script>
  import { viewVisualization } from '../../../lib/store';
  import CoOccurenceMatrix from '../../../lib/visualizations/co-occurence-matrix.svelte';
  import CoOccurenceNotebook from '../../../lib/curations/co-occurence-notebook.svelte';
  export let data;
</script>

<!-- <p>Current view: {$viewVisualization ? 'Visualization' : 'Curation'}</p> -->
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
{#if $viewVisualization}
  <CoOccurenceMatrix {data} />
{:else}
  <CoOccurenceNotebook {data} />
{/if}
