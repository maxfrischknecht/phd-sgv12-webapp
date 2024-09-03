<script>
	$: pageTitle = 'Generated Visualization';
</script>

<header>
	<!-- HEADER BAR -->
	<div class="grid grid-cols-12 gap-6">
		<div class="col-span-10 col-start-2 bg-black px-6 pb-1 h-12 flex items-center border-l border-r border-grey">
			<h1>Collection Ernst Brunner</h1>
			<h2 class="pl-4 text-blue">{pageTitle}</h2>
		</div>
	</div>
	<!-- VISUALIZATION GENERATOR -->
	<div class="grid grid-cols-12 gap-6">
		<div class="col-span-10 col-start-2 border border-grey">
			<div class="grid grid-cols-3 px-6 gap-6 bg-black">
				<div class="col-span-1 py-5 border-r border-grey">
					<p class="font-mono text-mono-sm pb-3">Analytical Interest</p>
					<p>Releationship</p>
                    <p>Time</p>
                    <p>Space</p>
				</div>
				<div class="col-span-1 pt-5 pb-4 border-r border-grey">
					<p class="font-mono text-mono-sm pb-3">Data</p>
					<p>Keywords</p>
					<p>Dates</p>
					<p>Locations</p>
					<p>Comments</p>
				</div>
                <div class="col-span-1 pt-5 pb-4 ">
					<p class="font-mono text-mono-sm pb-3">Data Manipulation</p>
					<p>Co-Occurence Matrix</p>
					<p>Force-Directed Graph</p>
				</div>
			</div>
		</div>
	</div>
</header>
