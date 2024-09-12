<script>
  import { viewVisualization } from '../../lib/store';
  import SeriesTimeline from '../../lib/visualizations/series-timeline.svelte';
  import SeriesTimelineNotebook from '../../lib/curations/series-timeline-notebook.svelte';
  export let data;
</script>


{#if $viewVisualization}
  <SeriesTimeline {data} />
{:else}
  <SeriesTimelineNotebook {data} />
{/if}
