/**
 * Calls the PIA API with the provided identifiers and returns the response data.
 *
 * @param {Array<string>} allIdentifiers - An array of "schema:identifier" strings.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 */
export async function callPiaApi(allIdentifiers) {
	// Step 1: Create the query string by joining identifiers with '+'
	const query_value = allIdentifiers.join('+');
	// Step 2: Define query parameters
	const per_page = 25;
	const page_count = 1;
	const ressource_class_id = 26;

	// Step 3: Construct the API URL with encoded query parameters
	const url = `https://participatory-archives.ch/api/items?fulltext_search=${encodeURIComponent(query_value)}&resource_class_id[]=${encodeURIComponent(ressource_class_id)}&item_set_id[]=150883&per_page=${encodeURIComponent(per_page)}&page=${encodeURIComponent(page_count)}`;

	// Log the constructed URL for debugging purposes
	console.log('API URL:', url);

	try {
		// Step 4: Perform the fetch request
		const response = await fetch(url);

		// Step 5: Check if the response status is OK (status code 200-299)
		if (!response.ok) {
			throw new Error(
				`Network response was not ok. Status: ${response.status} - ${response.statusText}`
			);
		}

		// Step 6: Parse the response data as JSON
		const data = await response.json();

		// Step 7: Return the parsed data
		return data;
	} catch (error) {
		// Handle any errors that occurred during the fetch
		console.error('Error fetching data from PIA API:', error);
		throw error; // Re-throw the error to allow further handling if needed
	}
}
