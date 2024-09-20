/**
 * Clears the set meta data in the store
 */
import { metaDataSetting } from "../store";
export function clearMetaData() {
    metaDataSetting.set([]);
    console.log("cleared meta data setting");
}