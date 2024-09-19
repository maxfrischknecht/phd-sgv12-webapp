/**
 * Constructs a resized IIIF image URL with specified width and auto height.
 *
 * @param {string} iiifUrl - The original IIIF image URL.
 * @param {number} width - The desired width in pixels.
 * @returns {string} - The modified IIIF image URL with size parameters.
 */
export function constructIIIFUrl(iiifUrl, width = 400) {
    // Ensure the URL ends with .jp2 or .jpg
    if (!/\.(jp2|jpg)$/.test(iiifUrl)) {
        console.warn(`Unsupported image format in URL: ${iiifUrl}`);
        return iiifUrl; // Return original URL if format is unsupported
    }

    // Remove any existing size parameters if present
    const baseUrl = iiifUrl.split('/full/')[0];

    // Construct the new URL with size parameter
    // Example: /full/400,/0/default.jpg
    const resizedUrl = `${baseUrl}/full/${width},/0/default.jpg`;

    return resizedUrl;
}