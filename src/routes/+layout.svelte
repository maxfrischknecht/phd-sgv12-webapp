<script>
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import '../app.css';
	import Header from '$lib/header.svelte';
	import Panel from '$lib/panel.svelte';
	import { headerHeight } from '../lib/store'; // Adjust the path as needed

	let contentStyle = '';

	const unsubscribe = headerHeight.subscribe((value) => {
		contentStyle = `margin-top: ${value}px; height: calc(100vh - ${value}px); width: 100vw; overflow: auto;`;
	});

	function adjustScroll() {
		if (window.location.pathname.includes('keywords-network-graph')) {
			const container = document.querySelector('#content');
			container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
			container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
		}
	}

	onMount(() => {
		adjustScroll();
	});

	afterUpdate(() => {
		adjustScroll();
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