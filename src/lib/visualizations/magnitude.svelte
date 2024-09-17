<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { currentData, currentKeyA } from './../../lib/store';
	import * as d3 from 'd3';

	// Dimensions for the SVG container
	let svg;
	// margin is used by Xaxis and Bars to be aligned
	let margin = { top: 12, right: 30, bottom: 24, left: 250 };
	let width = window.innerWidth - margin.right;
	let height; // define dynamically
	let barSpacing = 16;
	let barThickness = 1;
	let light = '#F4F4F4';
	let grey = '#5A5A5A';
	let blue = '#8390FA';

	// data and key (e.g. schema:temporal, schema:about)
	// from the store
	let displayData;
	let vizKey;
	const dataUnsubscribe = currentData.subscribe((value) => {
		displayData = value;
		updateViz();
	});
	const keyUnsubscribe = currentKeyA.subscribe((value) => {
		vizKey = value;
		updateViz();
	});

	// Create the SVG once on mount
	onMount(() => {
		console.log('mounting...');
		svg = d3.select('#svg-container').append('svg').attr('width', width);
		updateViz();
	});

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
		const xTicks = d3.ticks(1, 3000, 5);
		const customTicks = [0, ...xScale.ticks(5), 3000];
		xAxis
			.enter()
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(${margin.left}, 10)`)
			.merge(xAxis)
			.selectAll('text')
			.data(customTicks)
			.join('text')
			.attr('fill', light)
			.attr('x', (d) => xScale(d))
			.attr('y', 15)
			.attr('text-anchor', (d) => (d === 3000 ? 'end' : 'middle')) // Adjust anchor for the last tick
			// .attr('font-size', '12px')
			.text((d) => d);

		// Update Y Axis
		const yAxis = svg.selectAll('.y-axis').data([null]);
		yAxis
			.enter()
			.append('g')
			.attr('class', 'y-axis')
			.attr('transform', `translate(24, 20)`)
			.merge(yAxis)
			.selectAll('text')
			.data(yScaleDomain) // Use the fixed yScaleDomain here
			.join('text')
			.attr('x', 0)
			.attr('y', (d) => yScale(d)) // Keep y position consistent
			.attr('dy', '18')
			.attr('text-anchor', 'start')
			.attr('fill', light)
			.text((d) => d); // Label text remains consistent

		// Update Bars
		const bars = svg.selectAll('.bar').data(displayData, (d) => d[vizKey]); // Key by vizKey to ensure consistency

		bars
			.enter()
			.append('rect')
			.attr('class', 'hover-target') // A larger, invisible rectangle for hover events
			.attr('transform', `translate(0, 34)`)
			.attr('x', margin.left)
			.attr('height', barThickness + 10) // Make the hover area larger (10px more)
			.attr('width', (d) => xScale(3000)) // Full width of the bar area
			.attr('y', (d) => yScale(d[vizKey]) - 5) // Position the hover area around the thin bar
			.attr('fill', 'transparent') // Invisible but captures events
			.style('cursor', 'pointer')

		// visible bars
		bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('transform', `translate(0, 34)`)
			.attr('x', margin.left)
			.attr('height', barThickness)
			.attr('fill', light)
			.attr('y', (d) => yScale(d[vizKey])) // Initial y position
			.merge(bars)
			.transition()
			.duration(500)
			.attr('width', (d) => xScale(d.magnitude)); // Smoothly transition width

		d3.selectAll('.hover-target')
			.on('mouseover', function (event, d) {
				console.log('hover!');
				// Change bar color
				// d3.select(this).attr('fill', blue);
				d3.select(d3.selectAll('.bar').nodes()[yScaleDomain.indexOf(d[vizKey])]).attr(
					'fill',
					blue
				);

				// Find the corresponding y-axis label and change its color
				d3.selectAll('.y-axis text')
					.filter((label) => label === d[vizKey]) // Match the corresponding y-axis label
					.attr('fill', blue);
			})
			.on('mouseout', function (event, d) {
				// Restore original thin bar color
				d3.select(d3.selectAll('.bar').nodes()[yScaleDomain.indexOf(d[vizKey])]).attr(
					'fill',
					light
				);

				// Restore original y-axis label color
				d3.selectAll('.y-axis text')
					.filter((label) => label === d[vizKey]) // Match the corresponding y-axis label
					.attr('fill', light);
			});

		bars.exit().remove();
	}

	// unsubscribe data and key
	onDestroy(() => {
		dataUnsubscribe();
		keyUnsubscribe();
	});
</script>

<div id="svg-container"></div>

