<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;
	console.log(data.data);

	let mfBLue = '#8390FA';
	let mfGrey = '#5A5A5A';
	let mfLight = '#F4F4F4';

	let vizData = [];

	// sort our every item without a date
	data.data.forEach((element) => {
		if (element.date) vizData.push(element);
	});
	console.log(vizData);

	// create an array of all unique dates per row to draw markers
	const uniqueDatesMap = new Map();
	// Iterate over the data
	vizData.forEach((item) => {
		const key = `${item.series}_${item.date}`; // Create a unique key using series and date
		if (!uniqueDatesMap.has(key)) {
			uniqueDatesMap.set(key, { series: item.series, date: item.date });
		}
	});

	const uniqueDatesArray = Array.from(uniqueDatesMap.values());

	onMount(() => {
		const margin = { top: 10, right: 20, bottom: 40, left: 100 };

		// GET Y SCALE DATA & CALCULATE SVG HEIGHT
		// Get all 'series' values and sort them
		const allSeries = vizData.map((d) => d.series).sort();
		// Use set to remove duplicates, convert it into an array
		const uniqueSeries = Array.from(new Set(allSeries));
		// get how many points of the Y scale
		const yScalePointCount = uniqueSeries.length;
		console.log(yScalePointCount);
		// define row height
		const rowHeight = 12;
		// define svgHeight, add margins to reduce again later
		const vizHeight = yScalePointCount * rowHeight + margin.top + margin.bottom;
		// console.log(vizHeight)

		const width = window.innerWidth - margin.left - margin.right;
		const height = vizHeight - margin.top - margin.bottom;

		// // Set up the SVG canvas
		const svg = d3
			.select('#visualization')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// X Time Scale from January 1, 1927 to December 31, 1974
		const xScale = d3
			.scaleTime()
			.domain([new Date(1935, 0, 1), new Date(1980, 11, 31)])
			.range([0, width]);

		// Y discrete scale
		const yScale = d3.scalePoint().domain(uniqueSeries).range([0, height]).padding(0.5);

		// draw all items with an offset
		let seriesDateCounter = [];
		vizData.forEach((item) => {
			const parsedDate = parseDate(item.date);
			const series = item.series;

			const key = `${series}_${parsedDate}`;

			if (!seriesDateCounter[key]) {
				seriesDateCounter[key] = 0;
			}

			// Calculate the x offset for rectangles that share the same date and series
			const offsetX = seriesDateCounter[key] * 10; // Adjust the spacing for the overlap

			// Increment the counter for the next rectangle with the same date and series
			seriesDateCounter[key]++;

			svg
				.append('rect')
				.attr('x', xScale(parsedDate) + offsetX)
				.attr('y', yScale(series))
				.attr('width', 6)
				.attr('height', 6)
				.attr('fill', mfGrey);
		});


		// draw all unique date markers
		uniqueDatesArray.forEach((item) => {
			const parsedDate = parseDate(item.date);
			const series = item.series;

			svg
				.append('circle')
				.attr('cx', xScale(parsedDate) + 3)
				.attr('cy', yScale(series) - 3)
				.attr('r', 3)
				.attr('fill', mfBLue);
		});

		// X-axis
		const xAxis = svg
			.append('g')
			.attr('class', 'axis')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xScale).ticks(d3.timeYear.every(5)));

		// Add vertical grid lines based on the x-axis ticks
		svg
			.selectAll('.x-grid')
			.data(xScale.ticks(d3.timeYear.every(5)))
			.enter()
			.append('line')
			.attr('class', 'x-grid')
			.attr('x1', (d) => xScale(d))
			.attr('x2', (d) => xScale(d))
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke', mfBLue) // Color of the grid lines
			.attr('stroke-width', 1);

		// Y-axis
		const yAxis = svg
			.append('g')
			.attr('class', 'axis')
			.call(d3.axisLeft(yScale).ticks(vizData.length));

		svg
			.selectAll('.y-grid')
			.data(yScale.domain())
			.enter()
			.append('line')
			.attr('class', 'y-grid')
			.attr('y1', (d) => yScale(d))
			.attr('x1', 0)
			.attr('y2', (d) => yScale(d))
			.attr('x2', width)
			.attr('stroke', mfGrey) // Color of the grid lines
			.attr('stroke-width', 1);

		svg.selectAll('.axis path, .axis line').style('stroke', mfGrey); // Axis line color
	});

	function parseDate(dateStr) {
		// Check if the date string contains a range (using a '/')
		if (dateStr.includes('/')) {
			const [startStr, endStr] = dateStr.split('/');

			// Try to handle year, month, and day formats
			try {
				const startDate = new Date(startStr.trim());
				const endDate = new Date(endStr.trim());

				// Check if both start and end dates are valid
				if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
					// Return the midpoint between startDate and endDate
					const midpointTime = (startDate.getTime() + endDate.getTime()) / 2;
					return new Date(midpointTime);
				} else {
					console.warn(`Invalid date for range:`, dateStr);
					return null;
				}
			} catch (error) {
				console.warn(`Error parsing date range:`, dateStr);
				return null;
			}
		} else {
			// Handle single date strings
			const singleDate = new Date(dateStr.trim());
			if (!isNaN(singleDate.getTime())) {
				return singleDate;
			} else {
				console.warn(`Invalid date for data:`, dateStr);
				return null;
			}
		}
	}
</script>

<div class="svg-container">
	<svg id="visualization"></svg>
</div>
