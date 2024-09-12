<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;

	// dimensions
	let width = 2500;
	let height = 2500;

	// colors
	export let cLink = '#5A5A5A'; // 4d4d4d

	let grey = '#5A5A5A';
	let light = '#F4F4F4';
	let blue = '#8390FA';

	// Define a linear scale for the stroke width
	const strokeScale = d3
		.scaleLinear()
		.domain([5, d3.max(data.data.links, (d) => d.value)])
		.range([1, 15]);

	// force layout
	const simulation = d3
		.forceSimulation(data.data.nodes)
		.force(
			'link',
			d3
				.forceLink(data.data.links)
				.id((d) => d.id)
				.distance(150) // Reduced distance for tighter layout
		)
		.force('charge', d3.forceManyBody().strength(-60)) // Reduced repulsion for closer nodes
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('cluster', forceCluster(0.005)); // Custom force to cluster small networks

	function forceCluster(alpha) {
		return function () {
			for (const node of data.data.nodes) {
				const clusterCenter = { x: width / 2, y: height / 2 };
				const distanceToCenter = Math.sqrt(
					(node.x - clusterCenter.x) ** 2 + (node.y - clusterCenter.y) ** 2
				);
				// 600 outside
				const threshold = 1000; // Adjust this threshold to set how far outliers should be before being affected
				const targetDistance = 2000; // Adjust this to set how close the nodes should be moved towards the center

				if (distanceToCenter > threshold) {
					const damping = Math.max(
						0.1,
						1 - (distanceToCenter - threshold) / (threshold - targetDistance)
					); // Damping factor
					node.vx -= (node.x - clusterCenter.x) * alpha * damping;
					node.vy -= (node.y - clusterCenter.y) * alpha * damping;
				}
			}
		};
	}

	// add d3 logic in here
	onMount(() => {
		// select the svg container from the body
		const svg = d3.select('#network-svg').attr('width', width).attr('height', height);

		// links between nodes
		const link = svg
			.append('g')
			.selectAll('line')
			.data(data.data.links)
			.enter()
			.append('line')
			.attr('stroke-width', (d) => strokeScale(d.value)) // Use scale for stroke width
			.attr('stroke', cLink)
			.attr('stroke-opacity', '0.75');

		// nodes
		const node = svg
			.append('g')
			.selectAll('circle')
			.data(data.data.nodes)
			.enter()
			.append('circle')
			.attr('r', 4)
			.attr('fill', light)
			.attr('opacity', 1)
			.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

		// labels
		const label = svg
			.append('g')
			.selectAll('text')
			.data(data.data.nodes)
			.enter()
			.append('text')
			.attr('dx', '1em')
			.attr('dy', '.35em')
			.attr('x', 6)
			.attr('y', 3)
			.attr('class', 'labels')
			.attr('fill', light) // Set fill to inherit
			.text((d) => d.id);

		simulation.nodes(data.data.nodes).on('tick', ticked);
		simulation.force('link').links(data.data.links);

		// The ticked function in a D3.js force-directed graph is responsible for updating the
		// positions of the nodes, links, and labels during each iteration of the force simulation.
		// This function is called repeatedly by D3's force simulation as it calculates the new positions
		// for the nodes and links based on the forces applied to them.
		function ticked() {
			link
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
			label.attr('x', (d) => d.x).attr('y', (d) => d.y);
		}

		function dragstarted(event, d) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;

			// Change the color of the links connected to the dragged node
			link.filter((l) => l.source.id === d.id || l.target.id === d.id).attr('stroke', blue);

			// Change the color of the dragged node
			d3.select(this).attr('fill', blue);

			// Change the color of the labels connected to the dragged node
			// label.filter((l) => l.id === d.id).attr('fill', blue);

			// Change the color of the nodes and labels connected to the dragged node
			node
				.filter((n) =>
					data.data.links.some(
						(l) =>
							(l.source.id === d.id && l.target.id === n.id) ||
							(l.target.id === d.id && l.source.id === n.id)
					)
				)
				.attr('fill', blue);

			// label
			// 	.filter((l) =>
			// 		data.data.links.some(
			// 			(lnk) =>
			// 				(lnk.source.id === d.id && lnk.target.id === l.id) ||
			// 				(lnk.target.id === d.id && lnk.source.id === l.id)
			// 		)
			// 	)
			// 	.attr('fill', blue);

			// Change the color of the nodes and labels not connected to the dragged node
			node
				.filter(
					(n) =>
						!data.data.links.some(
							(l) =>
								(l.source.id === d.id && l.target.id === n.id) ||
								(l.target.id === d.id && l.source.id === n.id) ||
								n.id === d.id
						)
				)
				.attr('fill', grey);

			label
				.filter(
					(l) =>
						!data.data.links.some(
							(lnk) =>
								(lnk.source.id === d.id && lnk.target.id === l.id) ||
								(lnk.target.id === d.id && lnk.source.id === l.id) ||
								l.id === d.id
						)
				)
				.attr('fill', grey);

			// Change the opacity of the links not connected to the dragged node
			link.filter((l) => l.source.id !== d.id && l.target.id !== d.id).attr('stroke-opacity', 0.5);
		}

		function dragended(event, d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;

			// Reset the color of the links after dragging
			link.filter((l) => l.source.id === d.id || l.target.id === d.id).attr('stroke', cLink);

			// Reset the color of the dragged node
			d3.select(this).attr('fill', light);

			// Reset the color of the labels connected to the dragged node
			label.filter((l) => l.id === d.id).attr('fill', light);

			// Reset the color of the nodes and labels connected to the dragged node
			node
				.filter((n) =>
					data.data.links.some(
						(l) =>
							(l.source.id === d.id && l.target.id === n.id) ||
							(l.target.id === d.id && l.source.id === n.id)
					)
				)
				.attr('fill', light);

			label
				.filter((l) =>
					data.data.links.some(
						(lnk) =>
							(lnk.source.id === d.id && lnk.target.id === l.id) ||
							(lnk.target.id === d.id && lnk.source.id === l.id)
					)
				)
				.attr('fill', light);

			// Reset the color of the nodes and labels not connected to the dragged node
			node
				.filter(
					(n) =>
						!data.data.links.some(
							(l) =>
								(l.source.id === d.id && l.target.id === n.id) ||
								(l.target.id === d.id && l.source.id === n.id) ||
								n.id === d.id
						)
				)
				.attr('fill', light);

			label
				.filter(
					(l) =>
						!data.data.links.some(
							(lnk) =>
								(lnk.source.id === d.id && lnk.target.id === l.id) ||
								(lnk.target.id === d.id && lnk.source.id === l.id) ||
								l.id === d.id
						)
				)
				.attr('fill', light);

			// Reset the opacity of the links not connected to the dragged node
			link.filter((l) => l.source.id !== d.id && l.target.id !== d.id).attr('stroke-opacity', 0.75);
		}

		function dragged(event, d) {
			d.fx = event.x;
			d.fy = event.y;
		}
	});
</script>

<svg id="network-svg"></svg>

