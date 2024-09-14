<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let displayData;
	// the categories/values to be compared
	export let key1;
	export let key2;
	export let vizKey;

	console.log(displayData)

	let grey = '#5A5A5A';
	let light = '#F4F4F4';
	let blue = '#8390FA';

	// Dimensions for the SVG container
	let margin = { top: 16, right: 0, bottom: 0, left: 100 };
	let width = window.innerWidth - margin.left;
	let barSpacing = 10;
	let barThickness = 1;
	let height = displayData.length * (barThickness + barSpacing); // Height adjusts based on the number of bars

	// Svelte's reactive block to set up scales and draw the bar chart
	let xScale = d3
		.scaleLinear()
		// .domain([1, d3.max(displayData, (d) => d.magnitude)]) // Scale the X axis by the max value
		.domain([1, 3000]) // Scale the X axis by the max value
		.range([1, width - margin.left]);

	let yScale = d3
		.scaleBand()
		.domain(
			displayData.map((d) => {
				let val = d[vizKey];
				return val;
			})
		) // Map each name to a y-band
		.range([margin.top, height - margin.bottom]);

	let barHeight = yScale.bandwidth() - barSpacing; // Subtract 2px for spacing
</script>

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
					height={barHeight}
					fill={light}
				/>
			{/each}
		</g>

		<!-- Y Axis -->
		<g transform={`translate(90, 0)`}>
			{#each displayData as d}
				<text
					x={0}
					y={yScale(d[vizKey]) + yScale.bandwidth()}
					dy="13"
					text-anchor="end"
					fill={light}
				>
					<tspan x="0" dy="0">{d[vizKey]}</tspan>
					<!-- <tspan x="0" dy="1.2em">{d[key2][0]}</tspan> -->
				</text>
			{/each}
		</g>
	</svg>
</div>
