<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { currentData, currentKeyA, currentKeyB } from './../../lib/store';
	import * as d3 from 'd3';

	// Viz Variables
	let svg;
	let xAxisSvg;
	let margin = { top: 0, right: 0, bottom: 0, left: 0 };
	let width = window.innerWidth;
	let height = window.innerHeight;
	let xAxisSvgWidth; 

	let light = '#F4F4F4';
	let grey = '#5A5A5A';

	// Data Subscription to store
	let displayData;
	let vizKeyA, vizKeyB;
	const dataUnsubscribe = currentData.subscribe((value) => {
		displayData = value;
		updateViz();
	});
	const keyAUnsubscribe = currentKeyA.subscribe((value) => {
		vizKeyA = value;
		updateViz();
	});
	const keyBUnsubscribe = currentKeyB.subscribe((value) => {
		vizKeyB = value;
		updateViz();
	});

	// Create the SVG once on mount
	onMount(() => {
		svg = d3.select('#network-svg');
		xAxisSvg = d3.select('#x-axis-svg');
		updateViz();
	});

	function updateViz() {
		// Ensure that the svg is initialized
		if (!svg || !xAxisSvg || !displayData || !vizKeyA || !vizKeyB) return;
		console.log('generating co-occurence viz:', vizKeyA, vizKeyB);

		// Color Scale
		const thresholds = [10, 30, 50, 100, 200, 400, 600, 800, 1000];
		const numColors = 9;
		let colors = [];
		for (let i = 0; i < numColors; i++) {
			colors.push(d3.interpolateWarm(i / (numColors - 1)));
		}
		const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

		// X (cols) & Y (rows) Scale
		// get all items for each axis, remove duplicates for the scales
		let xScaleDomain = Array.from(new Set(displayData.map((d) => d.col)));
		let yScaleDomain = Array.from(new Set(displayData.map((d) => d.row)));
		// recalculate the width & height
		const itemSize = 10;
		width = xScaleDomain.length * itemSize;
		height = yScaleDomain.length * itemSize;
		xAxisSvgWidth = yScaleDomain.length * itemSize;
		svg.attr('width', width).attr('height', height);
		xAxisSvg.attr('width', xAxisSvgWidth).attr('height', 140);

		// create the scales
		const xScale = d3.scaleBand().domain(xScaleDomain).range([0, width]);
		const yScale = d3.scaleBand().domain(yScaleDomain).range([0, height]);

		// Transition
		const t = svg.transition().duration(500); // 500ms transition duration

		// Draw the matrix cells
		const cells = svg.selectAll('.cell').data(displayData, (d) => `${d.row}-${d.col}`); // Key by vizKey to ensure consistency

		let offsetY = 150;
		let offsetX = 150;

		cells
			.enter()
			.append('rect')
			.attr('class', 'cell')
			.merge(cells) // Merge the enter and update selections
			.attr('transform', `translate(${offsetX}, ${offsetY})`)
			.attr('x', (d) => xScale(d.col))
			.attr('y', (d) => yScale(d.row))
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.attr('fill', (d) => (d.value === 0 ? '#141414' : colorScale(d.value))) // Gray for empty cells
			.style('cursor', 'pointer')
			.attr('opacity', 0) // Start invisible
			.transition(t)
			.attr('opacity', 1); // Fade in;

		// remove if new data has less
		cells.exit().remove();

		// Draw the Y Axis
		let shortString = (d) => (d.length > 19 ? `${d.substring(0, 19)}` : d);
		const yAxis = svg.selectAll('.y-axis').data([null]);
		yAxis
			.enter()
			.append('g')
			.attr('class', 'y-axis')
			.attr('transform', `translate(24, ${offsetY - 10})`) // cells translate - font size
			.merge(yAxis)
			.selectAll('text')
			.data(yScaleDomain) // Use the fixed yScaleDomain here
			.join('text')
			.attr('x', 0)
			.attr('y', (d) => yScale(d)) // Keep y position consistent
			.attr('dy', '18')
			.attr('text-anchor', 'start')
			.attr('fill', light)
			.style('font-size', itemSize + 'px')
			.text((d) => shortString(d))
			.attr('opacity', 0) // Start invisible
			.transition(t)
			.attr('opacity', 1); // Fade in;; // Label text remains consistent

		// // make left axis absolute
		const svgContainer = document.getElementById('svg-container');
		const yAxisGroup = d3.select('.y-axis');

		svgContainer.addEventListener('scroll', () => {
			// Get the current horizontal scroll position
			const scrollX = svgContainer.scrollLeft;

			// Adjust the Y-axis position by updating the transform attribute
			yAxisGroup.attr('transform', `translate(${scrollX + 24}, ${offsetY - 10})`);
		});

		// Draw the Axis in a seperate svg for position fixed, xAxisSvg
		const xAxis = xAxisSvg.selectAll('.x-axis').data([null]);

		xAxis
			.enter()
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(154, 140)`) // Adjust as per your layout
			.merge(xAxis)
			.selectAll('text')
			.data(xScaleDomain)
			.join('text')
			// Set initial x and y positions to zero
			.attr('x', 0)
			.attr('y', 0)
			// Apply translation and rotation
			.attr('transform', (d) => `translate(${xScale(d) + xScale.bandwidth() / 2}, 0) rotate(-90)`)
			// Adjust text alignment and baseline
			.attr('text-anchor', 'start')
			.attr('alignment-baseline', 'middle')
			// Optional adjustments
			// .attr('dx', '0em')
			// .attr('dy', '-0.5em')
			.attr('fill', light)
			.style('font-size', `${itemSize}px`)
			.text((d) => d);
		// .attr('opacity', 0) // Start invisible
		// .transition(t)
		// .attr('opacity', 1); // Fade in;;
	}

	// unsubscribe data and key
	onDestroy(() => {
		dataUnsubscribe();
		keyAUnsubscribe();
		keyBUnsubscribe();
	});
</script>

<div id="svg-container">
	<div id="x-axis-container">
		<svg id="x-axis-svg"></svg>
	</div>
	<svg id="network-svg"></svg>
</div>

<style>
	#svg-container {
		width: 100vw;
		height: 100vh;
		overflow: auto;
	}
	#x-axis-container {
		/* border: 1px solid red !important; */
		position: absolute;
	}
</style>
