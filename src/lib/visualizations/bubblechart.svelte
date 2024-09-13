<script>
	import { headerHeight, imageIdsStore } from './../store';
	import * as d3 from 'd3';

	export let displayData;
	export let key;

	let grey = '#5A5A5A';
	let light = '#F4F4F4';
	let blue = '#8390FA';

	let contentHeight = window.innerHeight;
	const unsubscribeHeaderHeight = headerHeight.subscribe((value) => {
		contentHeight = window.innerHeight - value;
	});

	let width = window.innerWidth;
	let height = contentHeight;
	console.log('bubble', height);

	// Create D3 pack layout
	const createBubbleLayout = (displayData) => {
		const pack = d3.pack().size([width, height]).padding(8);

		const root = d3.hierarchy({ children: displayData }).sum((d) => d.magnitude);
		const nodes = pack(root).leaves();

		// Extract x, y, and r (radius) values from each node
		return nodes.map((d) => {
			// Check if the key exists in data and use it safely
			let label = d.data;
            console.log(label)
			return {
				x: d.x,
				y: d.y,
				r: d.r,
				data: label // Assigning the extracted data
			};
		});
	};

	let bubbles = createBubbleLayout(displayData);

	// Hover function for mouse over
	function handleMouseOver(event, d) {
		const hoveredCircle = d3.select(event.target);
		const padding = 10;

		const svg = d3.select('svg'); // Select the main SVG element

		// Append a group to hold the text and background rect
		const labelGroup = svg.append('g').attr('class', 'hoveredLabel');

		const textElement = labelGroup
			.append('text')
			.attr('x', d.x + d.r + 20) // Place text next to the circle
			.attr('y', d.y)
			.attr('text-anchor', 'left')
			.attr('dominant-baseline', 'middle')
			.attr('fill', 'grey')
			.attr('class', 'font-mono text-mono-sm')
			.text(`${d.data[key]}: ${d.data.magnitude}`); // Example text, modify as needed

		// Ensure the text element is appended before accessing its bounding box
		const textWidth = textElement.node().getBBox().width;

		labelGroup
			.insert('rect', 'text')
			.attr('x', d.x + d.r + 10)
			.attr('y', d.y - 15)
			.attr('width', textWidth + 2 * padding)
			.attr('height', 30)
			.attr('fill', 'lightgrey');
	}

	// Function to remove text on mouse out
	function handleMouseOut(event, d) {
		d3.selectAll('.hoveredLabel').remove(); // Remove the label group on mouse out
	}
</script>

<svg {width} {height}>
	{#each bubbles as bubble}
		<g transform={`translate(${bubble.x},${bubble.y})`}>
			<circle
				class="bubble"
				r={bubble.r}
				fill={light}
				on:mouseover={(event) => handleMouseOver(event, bubble)}
				on:mouseout={(event) => handleMouseOut(event, bubble)}
			/>
			<text class="label">{bubble.data[key]}</text>
		</g>
	{/each}
</svg>

<style>
	.bubble {
		/* fill-opacity: 0.7; */
		cursor: pointer;
		transition: 0.3s ease-in-out;
	}

	.bubble:hover {
		/* transform: scale(1.1); */
		fill: #8390fa;
	}

	.label {
		text-anchor: middle;
		alignment-baseline: middle;
		pointer-events: none;
	}
</style>
