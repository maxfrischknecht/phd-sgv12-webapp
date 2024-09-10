<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	export let data;

	onMount(() => {
		let cBG = '#141414';
		let cLight = '#F4F4F4';

		const width = 13000;
		const height = 13000;
		const margin = { top: 0, right: 0, bottom: 0, left: 0 };

		// custom color scale
		const thresholds = [10, 30, 50, 100, 200, 400, 600, 800, 1000];
		const numColors = 9;
		const colors = [];

		for (let i = 0; i < numColors; i++) {
			colors.push(d3.interpolateWarm(i / (numColors - 1)));
		}
		const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

		const sortedKeywords = sortMatrix(data.data);

		const xScale = d3.scaleBand().domain(sortedKeywords).range([0, width]);
		const yScale = d3.scaleBand().domain(sortedKeywords).range([0, height]);

		const svg = d3
			.select('#network-svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Draw the cells of the matrix
		svg
			.selectAll('.cell')
			.data(data.data)
			.enter()
			.append('rect')
			.attr('x', (d) => xScale(d.col))
			.attr('y', (d) => yScale(d.row))
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.attr('fill', (d) => (d.value === 0 ? '#141414' : colorScale(d.value))) // Gray for empty cells
			.attr('class', 'cell')
			.style('cursor', 'pointer')
			// Add mouseover event
			.on('mouseover', function (event, d) {
				// 'd' contains the data for the hovered cell (row, col, value)
				const hoveredCell = d3.select(this);
				const padding = 10; // Padding around the text

				// Append temporary text to calculate width
				const textElement = svg
					.append('text')
					.attr('x', +hoveredCell.attr('x') + 30)
					.attr('y', +hoveredCell.attr('y') + 3) // Positioned above the cell
					.attr('text-anchor', 'left')
					.attr('dominant-baseline', 'middle')
					.attr('fill', cBG)
					.attr('class', 'font-mono text-mono-sm')
					.text(`${d.value}x ${d.row.toUpperCase()} / ${d.col.toUpperCase()}`);

				// Get the width of the text element
				const textWidth = textElement.node().getBBox().width;

				// Append a background rect behind the text
				svg
					.append('rect')
					.attr('class', 'hoveredLabel')
					// .attr("x", +hoveredCell.attr("x") + xScale.bandwidth() / 2 - textWidth / 2 - padding)
					.attr('x', +hoveredCell.attr('x') + 20)
					.attr('y', +hoveredCell.attr('y') - 10) // Positioned above the text
					.attr('width', textWidth + 2 * padding)
					.attr('height', 25) // Text height + padding (adjust as needed)
					.attr('fill', cLight);
				// .attr("stroke", none)

				// Re-append the text to ensure it is on top of the background box
				textElement.raise().attr('class', 'hoveredLabel font-mono text-mono-sm');
			})
			// Add mouseout event
			.on('mouseout', function (event, d) {
				// Remove the labels and background box
				d3.selectAll('.hoveredLabel').remove();
			});
	});

	function sortMatrix(data) {
		// Calculate the total frequency for each keyword
		const keywordFrequencies = {};
		data.forEach((d) => {
			if (!keywordFrequencies[d.row]) keywordFrequencies[d.row] = 0;
			if (!keywordFrequencies[d.col]) keywordFrequencies[d.col] = 0;
			keywordFrequencies[d.row] += d.value;
			keywordFrequencies[d.col] += d.value;
		});

		// Sort keywords by total frequency
		const sortedKeywords = Object.keys(keywordFrequencies).sort(
			(a, b) => keywordFrequencies[b] - keywordFrequencies[a]
		);

		return sortedKeywords;
	}
</script>

<svg id="network-svg"></svg>
