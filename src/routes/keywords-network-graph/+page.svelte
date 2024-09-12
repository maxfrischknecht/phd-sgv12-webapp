<script>
  import { viewVisualization } from '../../lib/store';
  import NetworkGraph from '../../lib/visualizations/network-graph.svelte';
  import NetworkNotebook from '../../lib/curations/network-notebook.svelte';
  export let data;
</script>

{#if $viewVisualization}
  <NetworkGraph {data} />
{:else}
  <NetworkNotebook {data} />
{/if}
