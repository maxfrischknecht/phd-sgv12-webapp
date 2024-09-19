import { getSchemaIdentifiers } from './getSchemaIdentifiers.js';
import { extractIIIFData } from './extractIIIFData.js';
import { callPiaApi } from './callPiaApi.js';
import { objectViewerData, objectViewerLoading } from './../store.js';

/**
 * Receives the data associated with a section of a data visualization
 *
 * @param {Object} object with schema:identifiers
 */

export async function createObjectViewerData(newObject) {
    let loading = true;
    let error = null;

    console.log(newObject);
	try {
        objectViewerLoading.set(true);

		// Step 1: Extract all identifiers
		const allIdentifiers = getSchemaIdentifiers(newObject);
        const limitedData = allIdentifiers.slice(0, 5);

        console.log(limitedData)

		// Step 2: Call the PIA API with the identifiers
		const apiResponse = await callPiaApi(limitedData);

		// Step 3: Handle the API response
		console.log('API Response Data:', apiResponse);

		// Step 4: Extract the IIIF image url, identifier and name
		const imageData = extractIIIFData(apiResponse);
        objectViewerData.set(imageData)
		console.log(imageData);
	} catch (err) {
		error = err.message;
		console.error('An error occurred during the API call process:', error);
	} finally {
		objectViewerLoading.set(false);
	}
}
