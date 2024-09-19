// extractIIIFData.js

import { constructIIIFUrl } from './constructIIIFUrl.js';

/**
 * Extracts IIIF image URLs along with the first schema:identifier and schema:name from an array of API response objects.
 *
 * @param {Array<Object>} data - The array of API response objects.
 * @param {number} width - The desired width in pixels for the resized image URLs.
 * @returns {Array<Object>} - An array of objects, each containing:
 *                            - resizedIiifUrl: string
 *                            - identifier: string
 *                            - name: string
 */
export function extractIIIFData(data, width = 400) {
    return data.flatMap(item => {
        // Ensure 'schema:image' exists and is an array
        if (Array.isArray(item['schema:image'])) {
            // Extract the IIIF URLs
            const iiifUrls = item['schema:image']
                .filter(image => image['@id'])
                .map(image => image['@id']);

            // Extract the first identifier
            let identifier = 'Unknown Identifier';
            if (Array.isArray(item['schema:identifier']) && item['schema:identifier'].length > 0) {
                const firstIdentifier = item['schema:identifier'][0];
                // Handle different structures (object vs. string)
                if (typeof firstIdentifier === 'string') {
                    identifier = firstIdentifier;
                } else if (typeof firstIdentifier === 'object' && firstIdentifier['@value']) {
                    identifier = firstIdentifier['@value'];
                }
            }

            // Extract the first name value
            let name = 'Untitled';
            if (Array.isArray(item['schema:name']) && item['schema:name'].length > 0) {
                const firstName = item['schema:name'][0];
                if (typeof firstName === 'string') {
                    name = firstName;
                } else if (typeof firstName === 'object' && firstName['@value']) {
                    name = firstName['@value'];
                }
            }

            // Map each IIIF URL to an object with resized URL, identifier, and name
            return iiifUrls.map(url => ({
                url: constructIIIFUrl(url, width),
                identifier: identifier,
                name: name
            }));
        }
        return [];
    });
}