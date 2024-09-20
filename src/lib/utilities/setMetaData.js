/**
 * Sets the meta data in the store
 */
import { metaDataSetting } from "../store";

// update the metaDataSetting and order alphabetically for link construction
export function setMetaData(newObject) {
    metaDataSetting.update((objects) => {
        const index = objects.findIndex((obj) => obj.id === newObject.id);
        if (index === -1) {
            return [...objects, newObject].sort((a, b) => a.id.localeCompare(b.id));
        } else {
            return objects.filter((_, i) => i !== index).sort((a, b) => a.id.localeCompare(b.id));
        }
    });
}