<script>
  import { onMount } from 'svelte';
  import '../app.css';
  import Header from '$lib/header.svelte';
  import Panel from '$lib/panel.svelte';
  import { headerHeight } from '../lib/store'; // Adjust the path as needed
  import { onDestroy } from 'svelte';

  let contentStyle = '';

  const unsubscribe = headerHeight.subscribe(value => {
    contentStyle = `margin-top: ${value}px; height: calc(100vh - ${value}px); width: 100vw; overflow: auto;`;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<Header></Header>
<Panel></Panel>
<div id="content" style={contentStyle}>
  <slot></slot>
</div>

<!-- <style>
  #content {
    border: 2px solid greenyellow;
  }
</style> -->
