// /lib/store.js
import { writable } from 'svelte/store';

export const panelVisible = writable(false);
export const imageIdsStore = writable([]);
export const viewVisualization = writable(true);

export const headerHeight = writable(0);

export const metaDataSetting = writable([])
export const dataInterpretationSetting = writable({})

