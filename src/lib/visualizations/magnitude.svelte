<script>
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
	import { currentData, currentKey } from './../../lib/store';

	import * as d3 from 'd3';

	// data and key (e.g. schema:temporal, schema:about)
	// from the store
	let displayData, vizKey;
	const dataUnsubscribe = currentData.subscribe((value) => {
		displayData = value;
	});
	const keyUnsubscribe = currentKey.subscribe((value) => {
		vizKey = value;
	});

	// Dimensions for the SVG container
	let margin = { top: 16, right: 0, bottom: 0, left: 100 };
	let width = window.innerWidth - margin.left;
	let height; // define dynamically
	let barSpacing = 10;
	let barThickness = 1;
	let grey = '#5A5A5A';
	let light = '#F4F4F4';
	let blue = '#8390FA';

	onMount(() => {
		console.log('onMount: visualizing: ', vizKey);
		drawViz();
	});

	beforeUpdate(() => {
		console.log('beforeUpdate: visualizing: ', vizKey);
		console.log('new data received', displayData);
		drawViz();
	});

	// the visualization scale settings
	let yScale;

	// xScale, static
	let xScale = d3
		.scaleLinear()
		.domain([1, 3000])
		.range([1, width - margin.left]);

	function drawViz() {
		height =displayData.length * (barThickness + barSpacing) + margin.top + margin.bottom;

		const yScaleDomain = displayData.map((d) => d[vizKey]);
		yScale = d3
			.scaleBand()
			.domain(yScaleDomain)
			.range([margin.top, height - margin.bottom])
			.padding(0.01);

	}

	// unsubscribe data and key
	onDestroy(() => {
		dataUnsubscribe();
		keyUnsubscribe();
	});
</script>

{#if Array.isArray(displayData) && displayData.length > 0 && vizKey}
	<div id="svg-container">
		<svg {width} {height}>
			<!-- X Axis -->
			<g transform={`translate(${margin.left}, 0)`}>
				{#each xScale.ticks(10) as tick}
					<text fill={light} x={xScale(tick)} y={15} text-anchor="middle" font-size="12px">
						{tick}
					</text>
				{/each}
			</g>

			<!-- Bars -->
			<g transform="translate(0, 10)">
				{#each displayData as d}
					<rect
						x={margin.left}
						y={yScale(d[vizKey])}
						width={xScale(d.magnitude)}
						height={barThickness}
						fill={light}
					/>
				{/each}
			</g>

			<!-- Y Axis -->
			<g transform={`translate(90, 0)`}>
				{#each displayData as d}
					<text
						x={0}
						y={yScale(d[vizKey])}
						dy="13"
						text-anchor="end"
						fill={light}
					>
						{d[vizKey]}
					</text>
				{/each}
			</g>
		</svg>
	</div>
{/if}
