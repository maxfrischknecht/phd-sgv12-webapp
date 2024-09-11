<script>
	import * as d3 from 'd3';

	// get data from parent
	export let data;

	// dimensions
	let width = 13000;
	let height = 13000;
	let margin = { top: 0, right: 0, bottom: 0, left: 0 };

	// colors
	let grey = '#5A5A5A';
	let cLight = '#F4F4F4';

	// color scale
	const thresholds = [10, 30, 50, 100, 200, 400, 600, 800, 1000];
	const numColors = 9;
	let colors = [];
	for (let i = 0; i < numColors; i++) {
		colors.push(d3.interpolateWarm(i / (numColors - 1)));
	}
	const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

	// scales: use all keywords
	let keywordsArray = data.data.map((d) => d.row);
	const xScale = d3.scaleBand().domain(keywordsArray).range([0, width]);
	const yScale = d3.scaleBand().domain(keywordsArray).range([0, height]);

	function handleMouseOver(event, d) {
		const hoveredCell = d3.select(event.target);
		const padding = 10;

		const svg = d3.select('#network-svg');

		// Append a group to hold the text and background rect
		const labelGroup = svg.append('g').attr('class', 'hoveredLabel');

		const textElement = labelGroup
			.append('text')
			.attr('x', +hoveredCell.attr('x') + 30)
			.attr('y', +hoveredCell.attr('y') + 3)
			.attr('text-anchor', 'left')
			.attr('dominant-baseline', 'middle')
			.attr('fill', grey)
			.attr('class', 'font-mono text-mono-sm')
			.text(`${d.value}x ${d.row.toUpperCase()} / ${d.col.toUpperCase()}`);

		// Ensure the text element is appended before accessing its bounding box
		const textWidth = textElement.node().getBBox().width;

		labelGroup
			.insert('rect', 'text')
			.attr('x', +hoveredCell.attr('x') + 20)
			.attr('y', +hoveredCell.attr('y') - 10)
			.attr('width', textWidth + 2 * padding)
			.attr('height', 25)
			.attr('fill', cLight);
	}

	function handleMouseOut(event, d) {
		d3.selectAll('.hoveredLabel').remove();
	}
</script>

<svg
	id="network-svg"
	width={width + margin.left + margin.right}
	height={height + margin.top + margin.bottom}
>
	<g transform={`translate(${margin.left},${margin.top})`}>
		{#each data.data as d}
			<rect
				x={xScale(d.col)}
				y={yScale(d.row)}
				width={xScale.bandwidth()}
				height={yScale.bandwidth()}
				fill={colorScale(d.value)}
				class="cell"
				style="cursor: pointer"
				on:mouseover={(event) => handleMouseOver(event, d)}
				on:mouseout={(event) => handleMouseOut(event, d)}
			/>
		{/each}
	</g>
</svg>
