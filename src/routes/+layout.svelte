<script>
	import '../app.css';
	import Header from '$lib/header.svelte';
	import Panel from '$lib/panel.svelte';

</script>

<Header></Header>
<Panel></Panel>
<div class="">
	<slot></slot>
</div>
