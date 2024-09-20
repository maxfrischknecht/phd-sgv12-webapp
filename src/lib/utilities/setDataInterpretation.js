/**
 * Sets the data interpretation in the store
 * Sets the meta data automatically if necessary
 */
import { get } from 'svelte/store';
import { dataInterpretationSetting, metaDataSetting, appSettingsStore } from '../store';

export function setDataInterpretation(newObject) {
	// Set the dataInterpretationSetting
	dataInterpretationSetting.set(newObject);

	// Check if "variable-fixed" is not an empty string
	if (newObject['variable-fixed'] && newObject['variable-fixed'] !== '') {
		// Retrieve the current value of appSettingsStore
		const appSettings = get(appSettingsStore);

		// Ensure 'meta-data' exists and is an array
		if (Array.isArray(appSettings['meta-data'])) {
			// Search for the object in appSettingsStore['meta-data'] that matches the id from "variable-fixed"
			const fixedObject = appSettings['meta-data'].find(
				(item) => item.id === newObject['variable-fixed']
			);

			if (fixedObject) {
				// If the object is found, set it as metaDataSetting
				metaDataSetting.set([fixedObject]);
			} else {
				// If no matching object is found, clear metaDataSetting
				metaDataSetting.set([]);
			}
		} else {
			console.warn("'meta-data' is not an array in appSettingsStore.");
			metaDataSetting.set([]);
		}
	} else {
		// If "variable-fixed" is an empty string, clear metaDataSetting
		metaDataSetting.set([]);
	}
}
