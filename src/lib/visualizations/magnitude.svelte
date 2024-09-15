<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { currentData, currentKey } from './../../lib/store';
	import * as d3 from 'd3';

	// Dimensions for the SVG container
	let svg;
	let margin = { top: 16, right: 0, bottom: 0, left: 100 };
	let width = window.innerWidth - margin.left;
	let height; // define dynamically
	let barSpacing = 10;
	let barThickness = 1;
	let light = '#F4F4F4';

	// data and key (e.g. schema:temporal, schema:about)
	// from the store
	let displayData;
	let vizKey;
	const dataUnsubscribe = currentData.subscribe((value) => {
		displayData = value;
		updateViz();
	});
	const keyUnsubscribe = currentKey.subscribe((value) => {
		vizKey = value;
		updateViz();
	});

	// Create the SVG once on mount
	onMount(() => {
		console.log('mounting...');
		svg = d3.select('#svg-container').append('svg').attr('width', width);
	});

	// Function to update the visualization when data changes
	// function updateViz() {
	// 	if (!svg || !displayData || !vizKey) return;

	// 	// Define the dynamic height based on the data
	// 	height = displayData.length * (barThickness + barSpacing) + margin.top + margin.bottom;
	// 	svg.attr('height', height);

	// 	const yScaleDomain = displayData.map((d) => d[vizKey]);
	// 	const yScale = d3
	// 		.scaleBand()
	// 		.domain(yScaleDomain)
	// 		.range([margin.top, height - margin.bottom])
	// 		.padding(0.01);

	// 	const xScale = d3
	// 		.scaleLinear()
	// 		.domain([1, 3000])
	// 		.range([1, width - margin.left]);

	// 	// Update X Axis
	// 	const xAxis = svg.selectAll('.x-axis').data([null]);
	// 	xAxis
	// 		.enter()
	// 		.append('g')
	// 		.attr('class', 'x-axis')
	// 		.attr('transform', `translate(${margin.left}, 0)`)
	// 		.merge(xAxis)
	// 		.selectAll('text')
	// 		.data(xScale.ticks(10))
	// 		.join('text')
	// 		.attr('fill', light)
	// 		.attr('x', (d) => xScale(d))
	// 		.attr('y', 15)
	// 		.attr('text-anchor', 'middle')
	// 		.attr('font-size', '12px')
	// 		.text((d) => d);

	// 	// Update Bars
	// 	const bars = svg.selectAll('.bar').data(displayData);

	// 	bars
	// 		.enter()
	// 		.append('rect')
	// 		.attr('class', 'bar')
	// 		.attr('x', margin.left)
	// 		.attr('height', barThickness)
	// 		.attr('fill', light)
	// 		.merge(bars)
	// 		.transition()
	// 		.attr('y', (d) => yScale(d[vizKey]))
	// 		.attr('width', (d) => xScale(d.magnitude));

	// 	bars.exit().remove();

	// 	// Update Y Axis
	// 	const yAxis = svg.selectAll('.y-axis').data([null]);

	// 	yAxis
	// 		.enter()
	// 		.append('g')
	// 		.attr('class', 'y-axis')
	// 		.attr('transform', `translate(90, 0)`)
	// 		.merge(yAxis)
	// 		.selectAll('text')
	// 		.data(yScaleDomain) // Use the fixed yScaleDomain here
	// 		.join('text')
	// 		.attr('x', 0)
	// 		.attr('y', (d) => yScale(d)) // Keep y position consistent
	// 		.attr('dy', '13')
	// 		.attr('text-anchor', 'end')
	// 		.attr('fill', light)
	// 		.text((d) => d); // Label text remains consistent

	// 	// yAxis
	// 	// 	.enter()
	// 	// 	.append('g')
	// 	// 	.attr('class', 'y-axis')
	// 	// 	.attr('transform', `translate(90, 0)`)
	// 	// 	.merge(yAxis)
	// 	// 	.selectAll('text')
	// 	// 	.data(displayData)
	// 	// 	.join('text')
	// 	// 	.attr('x', 0)
	// 	// 	.attr('y', (d) => yScale(d[vizKey]))
	// 	// 	.attr('dy', '13')
	// 	// 	.attr('text-anchor', 'end')
	// 	// 	.attr('fill', light)
	// 	// 	.text((d) => d[vizKey]);
	// }

	function updateViz() {
	// Ensure that the svg is initialized
	if (!svg || !displayData || !vizKey) return;

	// Set a fixed order for the yScale domain, to prevent it from recalculating
	const yScaleDomain = displayData.map((d) => d[vizKey]);

	// Define the dynamic height based on the fixed number of items (length of yScaleDomain)
	height = yScaleDomain.length * (barThickness + barSpacing) + margin.top + margin.bottom;
	svg.attr('height', height);

	const yScale = d3
		.scaleBand()
		.domain(yScaleDomain) // Use a fixed domain to prevent the y-axis from changing
		.range([margin.top, height - margin.bottom])
		.padding(0.01);

	const xScale = d3
		.scaleLinear()
		.domain([1, 3000]) // Adjust this domain based on your data's expected range
		.range([1, width - margin.left]);

	// Update X Axis
	const xAxis = svg.selectAll('.x-axis').data([null]);
	xAxis
		.enter()
		.append('g')
		.attr('class', 'x-axis')
		.attr('transform', `translate(${margin.left}, 0)`)
		.merge(xAxis)
		.selectAll('text')
		.data(xScale.ticks(10))
		.join('text')
		.attr('fill', light)
		.attr('x', (d) => xScale(d))
		.attr('y', 15)
		.attr('text-anchor', 'middle')
		.attr('font-size', '12px')
		.text((d) => d);

	// Update Bars
	const bars = svg.selectAll('.bar').data(displayData, d => d[vizKey]); // Key by vizKey to ensure consistency

	bars
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', margin.left)
		.attr('height', barThickness)
		.attr('fill', light)
		.attr('y', (d) => yScale(d[vizKey])) // Initial y position
		.merge(bars)
		.transition()
		.duration(500)
		.attr('width', (d) => xScale(d.magnitude)) // Smoothly transition width
		// .attr('y', (d) => yScale(d[vizKey])); // Ensure y position stays consistent

			// 	const bars = svg.selectAll('.bar').data(displayData);

	// 	bars
	// 		.enter()
	// 		.append('rect')
	// 		.attr('class', 'bar')
	// 		.attr('x', margin.left)
	// 		.attr('height', barThickness)
	// 		.attr('fill', light)
	// 		.merge(bars)
	// 		.transition()
	// 		.attr('y', (d) => yScale(d[vizKey]))
	// 		.attr('width', (d) => xScale(d.magnitude));

	bars.exit().remove();

	// Update Y Axis
	const yAxis = svg.selectAll('.y-axis').data([null]);

	yAxis
		.enter()
		.append('g')
		.attr('class', 'y-axis')
		.attr('transform', `translate(90, 0)`)
		.merge(yAxis)
		.selectAll('text')
		.data(yScaleDomain) // Use the fixed yScaleDomain here
		.join('text')
		.attr('x', 0)
		.attr('y', (d) => yScale(d) - 10) // Keep y position consistent
		.attr('dy', '13')
		.attr('text-anchor', 'end')
		.attr('fill', light)
		.text((d) => d); // Label text remains consistent
}

	// unsubscribe data and key
	onDestroy(() => {
		dataUnsubscribe();
		keyUnsubscribe();
	});
</script>

<div id="svg-container"></div>
