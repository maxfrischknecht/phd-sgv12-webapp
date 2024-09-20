/**
 * Clears the set data interpretation in the store
 */
import { dataInterpretationSetting } from "../store";
export function clearDataInterpretation() {
    dataInterpretationSetting.set([]);
    console.log("cleared data interpretation setting");
}