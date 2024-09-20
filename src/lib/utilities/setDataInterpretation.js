/**
 * Sets the data interpretation in the store
 * Sets the meta data automatically if necessary
 */
import { dataInterpretationSetting } from "../store";
import { metaDataSetting } from "../store";

export function setDataInterpretation(newObject) {
	// Set the dataInterpretationSetting
	dataInterpretationSetting.set(newObject);

	// Check if "variable-fixed" is not an empty string
	if (newObject['variable-fixed'] && newObject['variable-fixed'] !== '') {
		// Search for the object in settings['meta-data'] that matches the id from "variable-fixed"
		const fixedObject = settings['meta-data'].find(
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
		// If "variable-fixed" is an empty string, clear metaDataSetting
		metaDataSetting.set([]);
	}
}
