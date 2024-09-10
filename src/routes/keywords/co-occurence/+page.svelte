<script>
	import { onMount } from 'svelte';

  let iframe;

  const customStyles = `
    body {
      background-color: #2e2e2e;
      color: white;
      border: 10px solid red !important;
    }
    .header {
      display: none;
    }
  `;

  function sendStylesToIframe() {
    const message = { type: "applyStyles", styles: customStyles };
    iframe.contentWindow.postMessage(message, "*");
  }

  // Send styles to iframe after it has loaded
  function handleIframeLoad() {
    sendStylesToIframe();
  }
</script>

<h1>Co-Occurence</h1>
<iframe
	bind:this={iframe}
	title="jupyiter lite notebook"
	src="https://maxfrischknecht.github.io/jupyterlite/notebooks/index.html?kernel=python&path=sgv-12_keyword-count.ipynb"
	width="100%"
	height="800px"
  on:load={handleIframeLoad}
>
</iframe>
