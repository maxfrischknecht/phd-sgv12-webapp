/**
 * Extracts all "schema:identifier" values from an object or an array of objects.
 *
 * @param {Object|Array<Object>} data - A single object or an array of objects containing "schema:identifier" properties.
 * @returns {Array<string>} - A flattened array of all "schema:identifier" values.
 * @throws {TypeError} - Throws an error if the input is neither an object nor an array of objects.
 */
export function getSchemaIdentifiers(data) {
	// If data is not provided, return an empty array
	if (data === null || data === undefined) {
	  return [];
	}
  
	// Determine if the input is an array
	const isArray = Array.isArray(data);
  
	// Normalize the input to an array for consistent processing
	const dataArray = isArray ? data : [data];
  
	// Initialize an array to hold all identifiers
	const allIdentifiers = [];
  
	// Iterate over each object in the array
	dataArray.forEach((item, index) => {
	  // Check if the item is an object
	  if (typeof item !== 'object' || item === null) {
		console.warn(`Item at index ${index} is not a valid object. Skipping.`);
		return;
	  }
  
	  // Check if the "schema:identifier" property exists
	  if (!item.hasOwnProperty('schema:identifier')) {
		console.warn(`Item at index ${index} is missing the "schema:identifier" property. Skipping.`);
		return;
	  }
  
	  // Check if "schema:identifier" is an array
	  if (!Array.isArray(item['schema:identifier'])) {
		console.warn(`"schema:identifier" in item at index ${index} is not an array. Skipping.`);
		return;
	  }
  
	  // Concatenate the identifiers to the allIdentifiers array
	  allIdentifiers.push(...item['schema:identifier']);
	});
  
	return allIdentifiers;
  }
